import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Authentication - signin', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    return () => Database.rollbackGlobalTransaction()
  })

  test('should return token when logged in with username', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/signin')
      .json({ usernameOrEmail: 'grilario', password: '12345678' })

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return token when logged in with email', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/signin')
      .json({ usernameOrEmail: 'luisfernandinho094@gmail.com', password: '12345678' })

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return error when not submitted username or email or password', async ({
    client,
  }) => {
    const responses = await Promise.all([
      client.post('/api/v1/auth/signin').json({ usernameOrEmail: 'luisfernandinho094@gmail.com' }),
      client.post('/api/v1/auth/signin').json({ password: '12345678' }),
    ])

    for (const response of responses) {
      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ rule: 'required' }] })
    }
  })

  test('should return error when user not exist in database', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/signin')
      .json({ usernameOrEmail: 'any@gmail.com', password: '12345678' })

    response.assertStatus(400)
  })

  test('should return error when password is incorrect', async ({ client }) => {
    const response = await client
      .post('/api/v1/auth/signin')
      .json({ usernameOrEmail: 'luisfernandinho094@gmail.com', password: '87654321' })

    response.assertStatus(400)
  })
})
