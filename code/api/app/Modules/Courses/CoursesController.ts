import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { randomUUID } from 'node:crypto'

import CourseCreateValidator from 'App/Validators/CourseCreateValidator'
import CourseUpdateValidator from 'App/Validators/CourseUpdateValidator'

import Course from 'App/Models/Course'

export default class CoursesController {
  public async list({ request }: HttpContextContract) {
    const { owner } = request.qs()

    if (owner) {
      const courses = await Course.query().where('ownerId', owner)

      return { data: courses }
    }

    return {}
  }

  public async find({ params: { id }, response }: HttpContextContract) {
    const course = await Course.query().where('id', id).preload('owner').first()

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    return {
      data: {
        course: course.serialize({ relations: { owner: { fields: ['username', 'name'] } } }),
      },
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
}
