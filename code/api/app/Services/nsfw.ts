import { rm, mkdir, readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

import * as tf from '@tensorflow/tfjs-node'
import * as nsfw from 'nsfwjs'

import { FFmpeg } from 'App/Services/ffmpeg'

let model: nsfw.NSFWJS

export async function initNSFW() {
  tf.enableProdMode()
  await tf.setBackend('tensorflow')
  model = await nsfw.load()
}

export class Nsfw {
  public ffmpeg: FFmpeg

  constructor(public videoPath: string) {
    this.ffmpeg = new FFmpeg(videoPath)
  }

  public async hasSexualContent(progress?: Function) {
    const outputDir = resolve(`/tmp/${randomUUID()}`)

    const metadata = await this.ffmpeg.metadata()
    const duration = metadata.format.duration!

    let currentFrame = 0
    const progressReport = setInterval(async () => {
      const percentage = Math.round((currentFrame * 33.33) / duration!)

      progress && progress(percentage)
    }, 5_000)

    let occurrences = 0
    for (let time = 0; time < duration!; time = time + 10) {
      this.deleteDirectory(outputDir, true)

      await this.ffmpeg.extractImages(time.toString(), '10', outputDir + '/%04d.bmp')

      const files = await readdir(outputDir)

      for (const file of files) {
        const buffer = await readFile(resolve(outputDir, file))
        const image = tf.node.decodeBmp(buffer)

        const predications = await model.classify(image, 3)

        image.dispose()

        for (const { className, probability } of predications) {
          if (!['Porn', 'Sexy', 'Hentai'].includes(className)) continue

          if (probability < 0.85) continue
          if (++occurrences < 10) continue

          this.deleteDirectory(outputDir, false)
          clearInterval(progressReport)

          return true
        }

        currentFrame++
      }
    }

    this.deleteDirectory(outputDir, false)
    clearInterval(progressReport)

    return false
  }

  private async deleteDirectory(directory: string, recreate: boolean) {
    await rm(directory, { recursive: true, force: true }).catch(() => null)

    recreate && (await mkdir(directory, { recursive: true }))
  }
}
