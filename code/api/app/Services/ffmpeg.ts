import Application from '@ioc:Adonis/Core/Application'

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobePath } from '@ffprobe-installer/ffprobe'

import { randomUUID } from 'node:crypto'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export class FFmpeg {
  private videoPath = ''
  private cachedMetadata: any

  constructor(videoPath: string) {
    this.videoPath = videoPath
  }

  public metadata() {
    return new Promise<FfprobeData>((resolve, reject) => {
      if (this.cachedMetadata) resolve(this.cachedMetadata)

      ffmpeg()
        .input(this.videoPath)
        .ffprobe((err, data) => {
          if (err) {
            return reject(err)
          }
          this.cachedMetadata = data
          return resolve(data)
        })
    })
  }

  public extractImages(startTime: string, duration: string, output: string) {
    return new Promise<void | Error>((resolve, reject) => {
      ffmpeg()
        .input(this.videoPath)
        .addInputOptions(['-ss', startTime])
        .addOutputOptions(['-t', duration, '-vf', 'fps=3/1'])
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

  public resize(qualities: string[], outputFolder: string, progress?: Function) {
    return new Promise<void>((resolve, reject) => {
      const generateName = (() => {
        return (quality: string) => `${outputFolder}/${quality}.mp4`
      })()

      const command = ffmpeg().input(this.videoPath)

      const sizes = {
        '360p': () => {
          command
            .output(generateName('360p'))
            .addOutputOptions([
              '-vf',
              'fps=24/1,scale=-2:360',
              '-c:v',
              'libx264',
              '-preset',
              'veryfast',
            ])
        },
        '480p': () => {
          command
            .addOutput(generateName('480p'))
            .addOutputOptions([
              '-vf',
              'fps=24/1,scale=-2:480',
              '-c:v',
              'libx264',
              '-preset',
              'veryfast',
            ])
        },
        '720p': () => {
          command
            .addOutput(generateName('720p'))
            .addOutputOptions([
              '-vf',
              'fps=24/1,scale=-2:720',
              '-c:v',
              'libx264',
              '-preset',
              'veryfast',
            ])
        },
        '1080p': () => {
          command
            .addOutput(generateName('1080p'))
            .addOutputOptions([
              '-vf',
              'fps=24/1,scale=-2:1080',
              '-c:v',
              'libx264',
              '-preset',
              'veryfast',
            ])
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
        .on('progress', ({ timemark }) => {
          function convertToSeconds(timemark) {
            const [hours, minutes, seconds] = timemark.slice(0, -3).split(':')

            return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)
          }

          const percentage =
            (convertToSeconds(timemark) * 100) / this.cachedMetadata.format.duration

          progress && progress(Math.round(percentage))
        })
        .run()
    })
  }

  public thumbnail() {
    return new Promise<string>((resolve, reject) => {
      const name = `${randomUUID()}.png`

      ffmpeg(this.videoPath)
        .on('end', () => {
          resolve(name)
        })
        .on('error', (err) => {
          console.log(err.message)

          return reject(err)
        })
        .thumbnail(
          {
            count: 1,
            timestamps: ['5%'],
            filename: name,
            size: '400x225',
          },
          Application.tmpPath('uploads')
        )
    })
  }
}
