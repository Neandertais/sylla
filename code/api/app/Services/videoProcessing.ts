import { dirname } from 'node:path'

import { Nsfw } from 'App/Services/nsfw'
import { videoQueue } from 'App/Services/queue'

export function process(file: string) {
  videoQueue.push(async () => {
    const nsfw = new Nsfw(file)

    if (await nsfw.hasSexualContent()) {
      throw new Error('has sexual content')
    }

    const metadata = await nsfw.ffmpeg.metadata()
    const qualities = ['360p', '480p', '720p', '1080p'].filter((quality) => {
      return +quality.slice(0, -1) <= metadata.streams[0].height!
    })

    await nsfw.ffmpeg.resize(qualities, dirname(file))

    return {
      qualities,
      duration: Math.floor(Number(metadata.streams[0].duration)),
    }
  })
}

videoQueue.addListener('success', ({ detail }) => {
  console.log(detail.result)
})
