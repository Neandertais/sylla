import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'

import { randomUUID } from 'node:crypto'

import CourseCreateValidator from 'App/Validators/CourseCreateValidator'
import CourseUpdateValidator from 'App/Validators/CourseUpdateValidator'

import Course from 'App/Models/Course'
import CourseStudent from 'App/Models/CourseStudent'
import CourseRatingValidator from 'App/Validators/CourseRatingValidator'
import CourseRating from 'App/Models/CourseRating'

export default class CoursesController {
  public async list({ auth: { user }, request }: HttpContextContract) {
    const { owner, keyword, student } = request.qs()

    if (keyword) {
      const courses = await Course.query().whereLike('keywords', `%${keyword}%`)

      return { data: { courses } }
    }

    if (owner) {
      const courses = await Course.query().where('ownerId', owner)

      return { data: { courses } }
    }

    // const keywords = await Database.rawQuery(
    //   "select distinct unnest(string_to_array(keywords, ',')) as keywords FROM courses limit 10;"
    // )

    if (user && student) {
      const courses = await Course.query().whereIn('id', (query) =>
        query.from('course_students').select('course_id').where('user_id', user.username)
      )

      return { data: { courses } }
    }

    function groupBy(list, keyGetter) {
      const map = new Map()
      list.forEach((item) => {
        const key = keyGetter(item)
        const collection = map.get(key)
        if (!collection) {
          map.set(key, [item])
        } else {
          collection.push(item)
        }
      })
      return map
    }

    const courses = groupBy(await Course.all(), (course) => course.keywords[0])

    return {
      data: {
        courses: Array.from(courses, (item) => ({ keyword: item[0], courses: item[1] })),
      },
    }
  }

  public async find({ auth: { user }, params: { id }, request, response }: HttpContextContract) {
    const { studio } = request.qs()

    const course = await Course.query()
      .where('id', id)
      .preload('owner')
      .preload('sections', (section) =>
        section
          .orderBy('position')
          .preload('videos', (video) =>
            studio
              ? video.orderBy('position')
              : video.orderBy('position').where('status', 'published')
          )
      )
      .first()

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    const [rating, { students }, student] = await Promise.all([
      Database.query()
        .from('course_ratings')
        .where('course_id', course.id)
        .count('*', 'count')
        .avg('rate', 'rate')
        .first(),
      Database.query()
        .from('course_students')
        .where('course_id', course.id)
        .count('*', 'students')
        .first(),
      CourseStudent.query()
        .where('user_id', user?.username || ' ')
        .where('course_id', course.id)
        .first(),
    ])

    const isStudent = student ? true : false
    const isOwner = course.ownerId === user?.username

    return {
      data: {
        course: {
          ...course.serialize({
            relations: {
              owner: { fields: ['username', 'name'] },
              sections: {
                fields: ['id', 'name'],
                relations: { videos: { fields: ['id', 'name', 'thumbnailUrl', 'status'] } },
              },
            },
          }),
          rating: {
            ...rating,
            rate: Math.round(+rating.rate * 10) / 10,
          },
          students,
          isStudent,
          isOwner,
        },
      },
    }
  }

  public async search({ request }: HttpContextContract) {
    const { q: query } = request.qs()

    const courses = await Course.query().whereRaw("fts @@ websearch_to_tsquery('portuguese', ?)", [
      query || ' ',
    ])

    return {
      data: courses,
    }
  }

  public async create({ auth: { user }, request, response }: HttpContextContract) {
    const payload = await request.validate(CourseCreateValidator)

    const course = new Course()

    if (payload.banner) {
      const filename = `${randomUUID()}.${payload.banner.extname}`

      await payload.banner.move(Application.tmpPath('uploads'), { name: filename })

      payload.banner = filename as any
    }

    course.fill(payload as any)
    await course.related('owner').associate(user!)

    return response.created({ data: { course } })
  }

  public async update({ params: { id }, bouncer, request, response }: HttpContextContract) {
    const course = await Course.find(id)

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    await bouncer.authorize('updateCourse', course)

    const payload = await request.validate(CourseUpdateValidator)

    if (payload.banner) {
      const filename = `${randomUUID()}.${payload.banner.extname}`

      await payload.banner.move(Application.tmpPath('uploads'), { name: filename })

      payload.banner = filename as any
    }

    if (payload.banner === null) {
      course.banner && (await Drive.delete(Application.tmpPath('uploads', course.banner)))
    }

    await course.merge(payload as any).save()

    return { data: { course } }
  }

  public async delete({ params: { id }, bouncer, response }: HttpContextContract) {
    const course = await Course.find(id)

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    await bouncer.authorize('deleteCourse', course)

    await course.delete()

    return response.noContent()
  }

  public async buy({ auth: { user }, params: { id }, bouncer, response }: HttpContextContract) {
    const course = await Course.query().where('id', id).preload('owner').first()

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    await bouncer.authorize('buyCourse', course)

    if (Number(course.price) > Number(user?.cash!)) {
      return response.badRequest({ errors: [{ message: 'insufficient money' }] })
    }

    await Database.transaction(async (trx) => {
      const student = new CourseStudent()

      student.userId = user?.username!
      student.courseId = course.id

      user?.useTransaction(trx)
      course.owner.useTransaction(trx)
      student.useTransaction(trx)

      await Promise.all([
        user?.merge({ cash: Number(user.cash) - Number(course.price) }).save(),
        course.owner.merge({ cash: Number(course.owner.cash) + Number(course.price) }).save(),
        student.save(),
      ])
    })

    return response.created()
  }

  public async evaluate({
    auth: { user },
    params: { id },
    bouncer,
    request,
    response,
  }: HttpContextContract) {
    const course = await Course.find(id)

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    await bouncer.authorize('evaluateCourse', course)

    const { rate } = await request.validate(CourseRatingValidator)

    const rating = await CourseRating.updateOrCreate(
      { userId: user?.username, courseId: course.id },
      { rate }
    )

    return { data: rating }
  }
}
