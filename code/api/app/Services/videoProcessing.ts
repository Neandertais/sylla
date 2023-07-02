import { dirname } from 'node:path'

import { Nsfw } from 'App/Services/nsfw'
import { videoQueue } from 'App/Services/queue'

import Video from 'App/Models/Video'

export function process(file: string, video: Video) {
  videoQueue.push(async () => {
    try {
      const nsfw = new Nsfw(file)

      const thumbnail = await nsfw.ffmpeg.thumbnail()
      video.merge({ thumbnail })
      await video.save()

      const hasSexualContent = await nsfw.hasSexualContent(async (currentProgress) => {
        video.merge({ processingProgress: Math.round(currentProgress / 2) })

        await video.save()
      })

      if (hasSexualContent) {
        video.merge({ status: 'sexualContent' })
        await video.save()

        return
      }

      const metadata = await nsfw.ffmpeg.metadata()
      const qualities = ['360p', '480p', '720p', '1080p'].filter((quality) => {
        return +quality.slice(0, -1) <= metadata.streams[0].height!
      })

      await nsfw.ffmpeg.resize(qualities, dirname(file), async (currentProgress) => {
        video.merge({ processingProgress: Math.round(currentProgress / 2 + 50) })

        await video.save()
      })

      video.merge({
        qualities,
        status: 'published',
        duration: Math.floor(Number(metadata.format.duration!)),
      })
      await video.save()
    } catch {
      video.merge({ status: 'error' })
      video.save().catch(() => {})
    }
  })
}
