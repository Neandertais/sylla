import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Drive from '@ioc:Adonis/Core/Drive'
import { createReadStream } from 'node:fs'

import Section from 'App/Models/Section'
import Video from 'App/Models/Video'
import { process } from 'App/Services/videoProcessing'

import VideoCreateValidator from 'App/Validators/VideoCreateValidator'
import VideoUpdateOrderValidator from 'App/Validators/VideoUpdateOrderValidator'
import VideoUpdateValidator from 'App/Validators/VideoUpdateValidator'

export default class VideosController {
  public async find({ params: { id }, response }: HttpContextContract) {
    const video = await Video.find(id)

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    return response.ok({ data: video })
  }

  public async create({ params, request, response, bouncer }: HttpContextContract) {
    const section = await Section.query().where('id', params.section).preload('course').first()

    if (!section) {
      return response.notFound({ errors: [{ message: 'section not found' }] })
    }

    await bouncer.authorize('createVideo', section)

    const payload = await request.validate(VideoCreateValidator)

    const lastVideo = await Video.query()
      .max('position', 'position')
      .where('sectionId', section.id)
      .first()

    const position = lastVideo ? lastVideo.position + 1 : 1

    const video = new Video()
    video.fill({ ...payload, position })
    await video.related('section').associate(section)

    return response.created({ data: { video } })
  }

  public async update({ params: { id }, request, response, bouncer }: HttpContextContract) {
    const video = await Video.query()
      .where('id', id)
      .preload('section', (section) => section.preload('course'))
      .first()

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    await bouncer.authorize('updateVideo', video)

    const payload = await request.validate(VideoUpdateValidator)

    await video.merge(payload).save()

    return response.ok({ data: { video } })
  }

  public async delete({ params: { id }, response, bouncer }: HttpContextContract) {
    const video = await Video.query()
      .where('id', id)
      .preload('section', (section) => section.preload('course'))
      .first()

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    await bouncer.authorize('deleteVideo', video)

    await video.delete()

    return response.noContent()
  }

  public async updateOrder({ params: { id }, request, response, bouncer }: HttpContextContract) {
    const video = await Video.query()
      .where('id', id)
      .preload('section', (section) => section.preload('course'))
      .first()

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    await bouncer.authorize('updateVideo', video)

    const payload = await request.validate(VideoUpdateOrderValidator)

    if (payload.videoBefore) {
      const videoBefore = await Video.query()
        .preload('section', (section) => section.preload('course'))
        .where('id', payload.videoBefore)
        .first()

      if (!videoBefore) {
        return response.notFound({ errors: [{ message: 'video before not found' }] })
      }

      // Check if video before is same course
      if (video.section.courseId !== videoBefore.section.courseId) {
        return response.unprocessableEntity({
          errors: [{ message: 'videos do not belong to them same course' }],
        })
      }

      // Logic to reorder when videoBefore same section
      if (video.section.id !== videoBefore.section.id) {
        video.sectionId = videoBefore.sectionId
      }

      // Logic to reorder when videoBefore section
      await Video.query()
        .where('sectionId', video.sectionId)
        .where('position', '<', video.position)
        .andWhere('position', '>', videoBefore.position)
        .increment('position', 1)

      video.position = videoBefore.position + 1
    } else if (payload.section) {
      const section = await Section.find(payload.section)

      if (!section) {
        return response.notFound({ errors: [{ message: 'section not found' }] })
      }

      video.sectionId = section.id
      video.position = 1

      await Video.query()
        .where('sectionId', video.sectionId)
        .whereNot('id', video.id)
        .increment('position', 1)
    } else {
      return response.unprocessableEntity()
    }

    await video.save()

    return response.ok({ data: { video } })
  }

  public async upload({ params: { id }, request, response, bouncer }: HttpContextContract) {
    const video = await Video.query()
      .where('id', id)
      .preload('section', (section) => section.preload('course'))
      .first()

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    await bouncer.authorize('updateVideo', video)

    if (video.status) {
      return response.notAcceptable({ errors: [{ message: 'video has been uploaded' }] })
    }

    const file = request.file('video', {
      size: '5gb',
      extnames: ['mp4', 'webm', 'mkv', 'avi'],
    })

    if (!file || !file.isValid) {
      return response.unsupportedMediaType({ errors: [{ message: 'unsupported video format' }] })
    }

    new Promise(async () => {
      const filename = `uploaded.${file.extname}`
      await file.moveToDisk(video.id, { name: filename }, 'video')

      video.merge({ status: 'processing' })
      await video.save()

      process(file.filePath!, video)
    })

    return response.noContent()
  }

  public async watch({ params: { id }, request, response }: HttpContextContract) {
    const video = await Video.query()
      .where('id', id)
      .preload('section', (section) => section.preload('course'))
      .first()

    if (!video) {
      return response.notFound({ errors: [{ message: 'video not found' }] })
    }

    // await bouncer.authorize('watchVideo', video)

    const quality = request.qs().q || '360p'

    if (!video.qualities.includes(quality)) {
      return response.notFound({ errors: [{ message: 'quality not found' }] })
    }

    const range = request.headers().range || ''
    const location = Drive.use('video').makePath(video.id + '/' + quality + '.mp4')

    const { size } = await Drive.use('video').getStats(video.id + '/' + quality + '.mp4')

    const CHUNK_SIZE = 10 ** 6 // 1MB

    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + CHUNK_SIZE, size - 1)
    const contentLength = end - start + 1

    response.header('Content-Range', `bytes ${start}-${end}/${size}`)
    response.header('Accept-Ranges', 'bytes')
    response.header('Content-Length', contentLength)
    response.header('Content-Type', 'video/mp4')

    return response.status(206).stream(createReadStream(location, { start, end }))
  }
}
