import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { initNSFW } from 'App/Services/nsfw'
import { process } from 'App/Services/videoProcessing'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const Drive = (await import('@ioc:Adonis/Core/Drive')).default
    const Video = (await import('App/Models/Video')).default

    await initNSFW()

    const notProcessedVideos = await Video.query().where('status', 'processing')

    notProcessedVideos.map(async (video) => {
      const directory = Drive.use('video').list(`${video.id}`)
      const uploadedFile = Drive.use('video').makePath(
        (await directory.toArray()).find((item) => item.location.includes('uploaded'))?.location!
      )

      process(uploadedFile, video)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
