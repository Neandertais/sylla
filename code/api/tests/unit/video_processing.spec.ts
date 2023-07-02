import { test } from '@japa/runner'

import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { readdir, rm, mkdir } from 'node:fs/promises'

import { Nsfw } from 'App/Services/nsfw'

test.group('Video processing', () => {
  test('should return true if video contains sexual content', async ({ assert }) => {
    const nsfw = new Nsfw(resolve('./tests/porn.mp4'))

    const result = await nsfw.hasSexualContent()

    assert.isTrue(result)
  })

  test('should return false if video not contains sexual content', async ({ assert }) => {
    const nsfw = new Nsfw(resolve('./tests/video.mp4'))

    const result = await nsfw.hasSexualContent()

    assert.isFalse(result)
  })

  test('should return metadata of video', async ({ assert }) => {
    const nsfw = new Nsfw(resolve('./tests/video.mp4'))

    const metadata = await nsfw.ffmpeg.metadata()

    assert.equal(metadata.format.size, 350709)
    assert.equal(metadata.format.format_name, 'mov,mp4,m4a,3gp,3g2,mj2')
  })

  test('should extract 10 images every frame', async ({ assert }) => {
    const nsfw = new Nsfw(resolve('./tests/video.mp4'))

    const output = resolve('tmp', randomUUID())
    await mkdir(output, { recursive: true })

    await nsfw.ffmpeg.extractImages('1', '1', output + '/%04d.bmp')

    const files = await readdir(output)
    await rm(output, { recursive: true, force: true })

    assert.equal(files.length, 10)
  })

  test('should resize video', async ({ assert }) => {
    const nsfw = new Nsfw(resolve('./tests/video.mp4'))

    const output = resolve('tmp', randomUUID())
    await mkdir(output, { recursive: true })

    await nsfw.ffmpeg.resize(['360p'], output)

    const files = await readdir(output)
    await rm(output, { recursive: true, force: true })

    assert.include(files, '360p.mp4')
  })
})
