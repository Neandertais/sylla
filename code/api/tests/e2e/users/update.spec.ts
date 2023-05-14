import Database from '@ioc:Adonis/Lucid/Database'
import { file } from '@ioc:Adonis/Core/Helpers'
import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Users - update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return user object with updated properties', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const newProperties = {
      name: 'Luis Fernando',
      biography: "Hello guys, I'm a programmer",
      profession: 'Programmer',
      socialLinks: {
        website: 'https://grilario.vercel.app',
      },
    }

    const response = await client
      .patch(`/api/v1/users/${user.username}`)
      .json(newProperties)
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: newProperties } })
  })

  test('should return user object with updated avatar', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const avatar = await file.generateJpg('2mb')

    const response = await client
      .patch(`/api/v1/users/${user.username}`)
      .file('avatar', avatar.contents, { filename: avatar.name })
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario' } } })
  })

  test('should return user object without avatar', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      avatar: 'any.png',
      password: '12345678',
    })

    const response = await client
      .patch(`/api/v1/users/${user.username}`)
      .json({ avatar: null })
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ data: { user: { username: 'grilario', avatarUrl: null } } })
  })

  test('should return unauthorized when user not allow update user', async ({ client }) => {
    const user = await User.create({
      username: 'grilario',
      email: 'luisfernandinho094@gmail.com',
      password: '12345678',
    })

    const userNotAllowed = await User.create({
      username: 'capivara',
      email: 'capivara@gmail.com',
      password: '12345678',
    })

    const response = await client.patch(`/api/v1/users/${user.username}`).loginAs(userNotAllowed)

    response.assertStatus(403)
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const response = await client.patch('/api/v1/users/any')

    response.assertStatus(401)
  })
})
