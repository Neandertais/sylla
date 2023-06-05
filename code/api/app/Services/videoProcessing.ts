import { videoQueue } from 'App/Services/queue'
import { checkSexualContent } from 'App/Services/nsfw'
import { getMetadata, resizeVideo } from 'App/Services/ffmpeg'

export function process(file: string) {
  videoQueue.push(async () => {
    const hasSexualContent = await checkSexualContent(file)

    if (hasSexualContent) {
      throw new Error('has sexual content')
    }

    const metadata = await getMetadata(file)

    const qualities = await resizeVideo(file, metadata.streams[0].height!)

    return {
      qualities,
      duration: Math.floor(Number(metadata.streams[0].duration)),
    }
  })
}

videoQueue.addListener('success', ({ detail }) => {
  console.log(detail.result)
})
