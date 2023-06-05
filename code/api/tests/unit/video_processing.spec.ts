import { test } from '@japa/runner'

import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { readdir, rm, mkdir } from 'node:fs/promises'

import { checkSexualContent } from 'App/Services/nsfw'
import { getMetadata, extractImages, resizeVideo } from 'App/Services/ffmpeg'

test.group('Video processing', () => {
  test('should return true if video contains sexual content', async ({ assert }) => {
    const video = resolve('./tests/porn.mp4')

    const result = await checkSexualContent(video)

    assert.isTrue(result)
  })

  test('should return false if video not contains sexual content', async ({ assert }) => {
    const video = resolve('./tests/video.mp4')

    const result = await checkSexualContent(video)

    assert.isFalse(result)
  })

  test('should return metadata of video', async ({ assert }) => {
    const video = resolve('./tests/video.mp4')

    const metadata = await getMetadata(video)

    assert.equal(metadata.format.size, 350709)
    assert.equal(metadata.format.format_name, 'mov,mp4,m4a,3gp,3g2,mj2')
  })

  test('should extract 10 images every frame', async ({ assert }) => {
    const video = resolve('./tests/video.mp4')
    const output = resolve(`./tests/${randomUUID()}`)

    await mkdir(output, { recursive: true })

    await extractImages(video, '1', '1', output + '/%04d.bmp')

    const files = await readdir(output)
    await rm(output, { recursive: true, force: true })

    assert.equal(files.length, 10)
  })

  test('should resize video', async ({ assert }) => {
    const video = resolve('./tests/video.mp4')

    const metadata = await getMetadata(video)

    await resizeVideo(video, metadata.streams[0].height!)

    const files = await readdir(resolve('./tests'))
    await rm(resolve('./tests/video_360.mp4'))

    assert.include(files, 'video_360.mp4')
  })
})
