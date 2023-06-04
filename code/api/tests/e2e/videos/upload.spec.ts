import { test } from '@japa/runner'
import { file } from '@ioc:Adonis/Core/Helpers'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'

import { readFile } from 'node:fs/promises'

import VideoFactory from 'Database/factories/VideoFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Videos - upload', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return no content when upload successful', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const file = await readFile('tests/e2e/videos/video.mp4')

    Drive.fake('video')

    const response = await client
      .patch(`api/v1/videos/${video.id}/upload`)
      .file('video', file, { filename: 'video' })
      .loginAs(video.section.course.owner)

    Drive.restore('video')

    response.assertStatus(204)
  })

  test('should return unauthorized when not logged', async ({ client }) => {
    const response = await client.patch('api/v1/videos/any/upload')

    response.assertStatus(401)
  })

  test('should return not found when video not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.patch('api/v1/videos/any/upload').loginAs(user)

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'video not found' }] })
  })

  test('should return unauthorized when logged in user is not the course owner', async ({
    client,
  }) => {
    const user = await UserFactory.create()
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const response = await client.patch(`api/v1/videos/${video.id}/upload`).loginAs(user)

    response.assertStatus(403)
  })

  test('should return unauthorized media', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const videoFile = await file.generatePng('1mb')

    Drive.fake('video')

    const response = await client
      .patch(`api/v1/videos/${video.id}/upload`)
      .file('video', videoFile.contents, { filename: videoFile.name })
      .loginAs(video.section.course.owner)

    Drive.restore('video')

    response.assertStatus(415)
    response.assertBody({
      errors: [
        {
          message: 'unsupported video format',
        },
      ],
    })
  })
})
