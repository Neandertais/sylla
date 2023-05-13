import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Authentication - logout', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return ok when user has logged out', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const response = await client.post('/api/v1/auth/logout').loginAs(user)

    response.assertStatus(204)
  })

  test('should return unauthorized status when user not logged in', async ({ client }) => {
    const response = await client.post('/api/v1/auth/logout')

    response.assertStatus(401)
  })
})
