import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Users - find', (group) => {
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

    const response = await client.get(`/api/v1/users/${user.username}`)

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return not found when user not exists', async ({ client }) => {
    const response = await client.get('/api/v1/users/any')

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'user not found' }] })
  })
})
