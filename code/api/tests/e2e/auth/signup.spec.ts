import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'

test.group('Authentication - signup', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return user object when creating user', async ({ client }) => {
    const response = await client
      .post('api/v1/auth/signup')
      .json({ username: 'grilario', email: 'luisfernandinho094@gmail.com', password: '12345678' })

    response.assertStatus(201)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return error when not submitted username or email or password', async ({
    client,
  }) => {
    const responses = await Promise.all([
      client.post('api/v1/auth/signup').json({
        email: 'luisfernandinho094@gmail.com',
        password: '12345678',
      }),
      client.post('api/v1/auth/signup').json({
        username: 'grilario',
        password: '12345678',
      }),
      client.post('api/v1/auth/signup').json({
        username: 'grilario',
        email: 'luisfernandinho094@gmail.com',
      }),
    ])

    for (const response of responses) {
      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ rule: 'required' }] })
    }
  })

  test('should return error status when username or email is already in use', async ({
    client,
  }) => {
    await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const responses = await Promise.all([
      client.post('api/v1/auth/signup').json({
        username: 'grilario',
        email: 'any@gmail.com',
        password: '12345678',
      }),
      client.post('api/v1/auth/signup').json({
        username: 'capivara',
        email: 'luisfernandinho094@gmail.com',
        password: '12345678',
      }),
    ])

    for (const response of responses) {
      response.assertStatus(422)
      response.assertBodyContains({ errors: [{ rule: 'unique' }] })
    }
  })
})
