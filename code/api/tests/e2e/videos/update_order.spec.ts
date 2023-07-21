import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'
import VideoFactory from 'Database/factories/VideoFactory'

test.group('Videos - update order', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return video object with position updated', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const videoBefore = await VideoFactory.merge({
      sectionId: video.sectionId,
    }).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        video: {
          position: videoBefore.position + 1,
        },
      },
    })
  })

  test('should return video object with position first ', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    )
      .merge({ position: 10 })
      .create()

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: null })
      .loginAs(video.section.course.owner)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        video: {
          position: 1,
        },
      },
    })
  }).skip()

  test('should return video object with position updated and section', async ({
    client,
    assert,
  }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const videoBefore = await VideoFactory.with('section', 1, (section) =>
      section.merge({ courseId: video.section.courseId })
    ).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner)

    const videoRefreshed = await video.refresh()

    assert.equal(videoRefreshed.sectionId, videoBefore.sectionId)
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        video: {
          position: videoBefore.position + 1,
        },
      },
    })
  })

  test('should return unauthorized when not logged', async ({ client }) => {
    const response = await client.patch('api/v1/videos/any/order')

    response.assertStatus(401)
  })

  test('should return not found when video not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.patch('api/v1/videos/any/order').loginAs(user)

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

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: null })
      .loginAs(user)

    response.assertStatus(403)
  })

  test('should return not found when videoBefore not exists', async ({ client }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: '123456712345671234567' })
      .loginAs(video.section.course.owner)

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'video before not found' }] })
  })

  test('should return unprocessable when videos are from courses are different', async ({
    client,
  }) => {
    const video = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.with('owner'))
    ).create()
    const videoBefore = await VideoFactory.with('section', 1, (section) =>
      section.with('course', 1, (course) => course.merge({ ownerId: video.section.course.ownerId }))
    ).create()

    const response = await client
      .patch(`api/v1/videos/${video.id}/order`)
      .json({ videoBefore: videoBefore.id })
      .loginAs(video.section.course.owner)

    response.assertStatus(422)
    response.assertBody({
      errors: [{ message: 'videos do not belong to them same course' }],
    })
  })
})
