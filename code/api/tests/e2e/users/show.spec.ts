import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Users - show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return user', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const response = await client.get('/api/v1/user').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const response = await client.get('/api/v1/user')

    response.assertStatus(401)
  })
})
