import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobePath } from '@ffprobe-installer/ffprobe'

import path from 'node:path'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export class FFmpeg {
  private videoPath = ''

  constructor(videoPath: string) {
    this.videoPath = videoPath
  }

  public metadata() {
    return new Promise<FfprobeData>((resolve, reject) => {
      ffmpeg()
        .input(this.videoPath)
        .ffprobe((err, data) => {
          if (err) {
            return reject(err)
          }

          return resolve(data)
        })
    })
  }

  public extractImages(startTime: string, duration: string, output: string) {
    return new Promise<void | Error>((resolve, reject) => {
      ffmpeg()
        .input(this.videoPath)
        .addInputOptions(['-ss', startTime])
        .addOutputOptions(['-t', duration, '-vf', 'fps=10/1,scale=540:-1'])
        .output(output)
        .on('end', () => {
          resolve()
        })
        .on('error', (err) => {
          return reject(err)
        })
        .run()
    })
  }

  public resize(qualities: string[], outputFolder: string) {
    return new Promise<void>((resolve, reject) => {
      const generateName = (() => {
        const basename = path.basename(this.videoPath, path.extname(this.videoPath))

        return (quality: string) => `${outputFolder}/${basename}_${quality}.mp4`
      })()

      const command = ffmpeg().input(this.videoPath)

      const sizes = {
        '360p': () => {
          command
            .output(generateName('360p'))
            .addOutputOptions(['-vf', 'fps=24/1,scale=-1:360', '-c:v', 'h264'])
        },
        '480p': () => {
          command
            .output(generateName('480p'))
            .addOutputOptions(['-vf', 'fps=24/1,scale=-1:360', '-c:v', 'h264'])
        },
        '720p': () => {
          command
            .output(generateName('720p'))
            .addOutputOptions(['-vf', 'fps=24/1,scale=-1:360', '-c:v', 'h264'])
        },
        '1080p': () => {
          command
            .output(generateName('1080p'))
            .addOutputOptions(['-vf', 'fps=24/1,scale=-1:360', '-c:v', 'h264'])
        },
      }

      for (const quality of qualities) {
        sizes[quality]()
      }

      command
        .on('end', () => {
          resolve()
        })
        .on('error', (err) => {
          return reject(err)
        })
        .run()
    })
  }
}
