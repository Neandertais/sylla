import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'
import VideoFactory from 'Database/factories/VideoFactory'

test.group('Videos - update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return video when updated wih successful', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}`)
      .json({ name: 'How to install Node JS' })
      .loginAs(video.section.course.owner)

    response.assertStatus(200)
    response.assertBodyContains({ data: { video: { name: 'How to install Node JS' } } })
  })

  test('should return not found when video not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client
      .patch(`api/v1/videos/any`)
      .json({ name: 'How to install Node JS' })
      .loginAs(user)

    response.assertStatus(404)
  })

  test('should return unauthorized when user not owner of course', async ({ client }) => {
    const user = await UserFactory.create()
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}`)
      .json({ name: 'How to install Node JS' })
      .loginAs(user)

    response.assertStatus(403)
  })
})
