import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import SectionFactory from 'Database/factories/SectionFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Sections update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return section object when updated properties', async ({ client }) => {
    const section = await SectionFactory.with('course', 1, (course) =>
      course.with('owner')
    ).create()
    const newSection = await SectionFactory.make()

    const response = await client
      .patch(`api/v1/sections/${section.id}`)
      .json({ name: newSection.name })
      .loginAs(section.course.owner)

    response.assertStatus(200)
    response.assertBodyContains({ data: { section: { name: newSection.name } } })
  })

  test('should return unauthorized when not logged', async ({ client }) => {
    const response = await client.patch('api/v1/sections/any')

    response.assertStatus(401)
  })

  test('should return not found when section not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.patch('api/v1/sections/any').loginAs(user)

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'section not found' }] })
  })

  test('should return unauthorized when logged in user is not the course owner', async ({
    client,
  }) => {
    const user = await UserFactory.create()
    const section = await SectionFactory.with('course', 1, (course) =>
      course.with('owner')
    ).create()
    const newSection = await SectionFactory.make()

    const response = await client
      .patch(`api/v1/sections/${section.id}`)
      .json({ name: newSection.name })
      .loginAs(user)

    response.assertStatus(403)
  })

  test('should return error status when name submitted is invalid', async ({ client }) => {
    const section = await SectionFactory.with('course', 1, (course) =>
      course.with('owner')
    ).create()

    const response = await client
      .patch(`api/v1/sections/${section.id}`)
      .json({ name: 'A' })
      .loginAs(section.course.owner)

    response.assertStatus(422)
  })
})
