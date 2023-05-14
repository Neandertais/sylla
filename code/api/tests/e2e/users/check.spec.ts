import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Users - check', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return no content', async ({ client }) => {
    const user = {
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    }

    const response = await client.post('/api/v1/users/check').json(user)

    response.assertStatus(204)
  })

  test('should return unprocessable when username or email already use', async ({ client }) => {
    const user = {
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    }

    await User.create(user)

    const response = await client.post('/api/v1/users/check').json(user)

    response.assertStatus(422)
  })
})
