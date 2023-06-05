import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
import { path as ffprobePath } from '@ffprobe-installer/ffprobe'

import path from 'node:path'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

export function getMetadata(file: string) {
  return new Promise<FfprobeData>((resolve, reject) => {
    ffmpeg()
      .input(file)
      .ffprobe((err, data) => {
        if (err) {
          return reject(err)
        }

        return resolve(data)
      })
  })
}

export function extractImages(file: string, startTime: string, duration: string, output: string) {
  return new Promise<void | Error>((resolve, reject) => {
    ffmpeg()
      .input(file)
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

export function resizeVideo(filename: string, originalSize: number) {
  return new Promise<string[] | Error>((resolve, reject) => {
    const name = path.basename(filename, path.extname(filename))
    const videosFolder = path.dirname(filename)

    const qualities: string[] = []

    const command = ffmpeg().input(filename)

    if (originalSize >= 360) {
      command
        .output(`${videosFolder}/${name}_360.mp4`)
        .addOutputOptions(['-vf', 'fps=24/1,scale=-1:360', '-c:v', 'h264'])

      qualities.push('360p')
    }

    if (originalSize >= 480) {
      command
        .output(`${videosFolder}/${name}_480.mp4`)
        .addOutputOptions(['-vf', 'fps=24/1,scale=-1:480', '-c:v', 'h264'])

      qualities.push('480p')
    }

    if (originalSize >= 720) {
      command
        .output(`${videosFolder}/${name}_720.mp4`)
        .addOutputOptions(['-vf', 'fps=24/1,scale=-1:720', '-c:v', 'h264'])

      qualities.push('720p')
    }

    if (originalSize >= 1080) {
      command
        .output(`${videosFolder}/${name}_1080.mp4`)
        .addOutputOptions(['-vf', 'fps=24/1,scale=-1:1080', '-c:v', 'h264'])

      qualities.push('1080p')
    }

    command
      .on('end', () => {
        resolve(qualities)
      })
      .on('error', (err) => {
        return reject(err)
      })
      .run()
  })
}
