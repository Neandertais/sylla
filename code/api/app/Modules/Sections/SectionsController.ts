import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Course from 'App/Models/Course'
import Section from 'App/Models/Section'

import SectionCreateValidator from 'App/Validators/SectionCreateValidator'
import SectionUpdateOrderValidator from 'App/Validators/SectionUpdateOrderValidator'
import SectionUpdateValidator from 'App/Validators/SectionUpdateValidator'

export default class SectionsController {
  public async list({ params: { course }, response }: HttpContextContract) {
    // Check if course exists
    if (!(await Course.find(course))) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    // Query sections with course ordered by position
    const sections = await Section.query()
      .preload('videos', (videos) => {
        videos.where('status', 'published').orWhere('status', 'processing').orderBy('position')
      })
      .where('courseId', course)
      .orderBy('position')

    return response.ok({ data: sections })
  }

  public async create({ params, request, response, bouncer }: HttpContextContract) {
    const course = await Course.find(params.course)

    if (!course) {
      return response.notFound({ errors: [{ message: 'course not found' }] })
    }

    await bouncer.authorize('createSection', course)

    const payload = await request.validate(SectionCreateValidator)

    const lastSection = await Section.query()
      .max('position', 'position')
      .where('courseId', course.id)
      .first()

    const position = lastSection ? lastSection.position + 1 : 1

    const section = new Section()
    section.fill({ ...payload, position })
    await section.related('course').associate(course)

    await section.save()

    return response.created({ data: { section } })
  }

  public async find({ params: { id }, response }: HttpContextContract) {
    const section = await Section.find(id)

    if (!section) {
      return response.notFound({ errors: [{ message: 'section not found' }] })
    }

    return response.ok({ data: { section } })
  }

  public async update({ params: { id }, request, response, bouncer }: HttpContextContract) {
    const section = await Section.query().preload('course').where('id', id).first()

    if (!section) {
      return response.notFound({ errors: [{ message: 'section not found' }] })
    }

    await bouncer.authorize('updateSection', section.course)

    const payload = await request.validate(SectionUpdateValidator)

    await section.merge(payload).save()

    return response.ok({ data: { section } })
  }

  public async delete({ params: { id }, response, bouncer }: HttpContextContract) {
    const section = await Section.query().preload('course').where('id', id).first()

    if (!section) {
      return response.notFound({ errors: [{ message: 'section not found' }] })
    }

    await bouncer.authorize('deleteSection', section.course)

    await section.delete()

    return response.noContent()
  }

  public async updateOrder({ params: { id }, request, response, bouncer }: HttpContextContract) {
    const section = await Section.query().preload('course').where('id', id).first()

    if (!section) {
      return response.notFound({ errors: [{ message: 'section not found' }] })
    }

    await bouncer.authorize('updateSection', section.course)

    const payload = await request.validate(SectionUpdateOrderValidator)

    if (payload.sectionBefore) {
      const sectionBefore = await Section.find(payload.sectionBefore)

      if (!sectionBefore) {
        return response.notFound({ errors: [{ message: 'section before not found' }] })
      }

      if (section.courseId !== sectionBefore.courseId) {
        return response.unprocessableEntity({
          errors: [{ message: 'sections do not belong to them same course' }],
        })
      }

      // Logic to reorder when itemBefore
      await Section.query()
        .where('position', '<', section.position)
        .andWhere('position', '>', sectionBefore.position)
        .increment('position', 1)

      section.position = sectionBefore.position! + 1
    } else {
      // Logic to reorder when not itemBefore
      await Section.query()
        .where('courseId', section.courseId)
        .whereNot('id', section.id)
        .increment('position', 1)

      section.position = 1
    }

    await section.save()

    return response.ok({ data: { section } })
  }
}
