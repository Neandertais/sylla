import Database from '@ioc:Adonis/Lucid/Database'
import { file } from '@ioc:Adonis/Core/Helpers'
import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'

test.group('Courses - create', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return course', async ({ client }) => {
    const user = await UserFactory.create()

    const banner = await file.generateJpg('2mb')

    const response = await client
      .post('/api/v1/courses')
      .file('banner', banner.contents, { filename: banner.name })
      .fields({ name: 'Javascript Object Oriented', price: 15.9 })
      .loginAs(user)

    response.assertStatus(201)
    response.assertBodyContains({
      data: { course: { name: 'Javascript Object Oriented', price: 15.9 } },
    })
  })

  test('should return error when name or price not submitted', async ({ client }) => {
    const user = await UserFactory.create()

    const responses = await Promise.all([
      client.post('/api/v1/courses').json({ name: 'Javascript Object Oriented' }).loginAs(user),
      client.post('/api/v1/courses').json({ price: 15.9 }).loginAs(user),
    ])

    for (const response of responses) {
      response.assertStatus(422)
    }
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const response = await client.post('/api/v1/courses')

    response.assertStatus(401)
  })
})
