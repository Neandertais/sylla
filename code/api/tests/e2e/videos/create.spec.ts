import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import SectionFactory from 'Database/factories/SectionFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Videos - create', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return video when created wih successful', async ({ client }) => {
    const section = await SectionFactory.with('course', 1, (course) =>
      course.with('owner')
    ).create()

    const response = await client
      .post(`api/v1/sections/${section.id}/videos`)
      .json({ name: 'How to install Node JS' })
      .loginAs(section.course.owner)

    response.assertStatus(201)
    response.assertBodyContains({ data: { video: { name: 'How to install Node JS' } } })
  })

  test('should return not found when section not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client
      .post(`api/v1/sections/any/videos`)
      .json({ name: 'How to install Node JS' })
      .loginAs(user)

    response.assertStatus(404)
  })

  test('should return unauthorized when user not owner of course', async ({ client }) => {
    const user = await UserFactory.create()
    const section = await SectionFactory.with('course', 1, (course) =>
      course.with('owner')
    ).create()

    const response = await client
      .post(`api/v1/sections/${section.id}/videos`)
      .json({ name: 'How to install Node JS' })
      .loginAs(user)

    response.assertStatus(403)
  })
})
