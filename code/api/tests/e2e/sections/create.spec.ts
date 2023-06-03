import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import CourseFactory from 'Database/factories/CourseFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Sections - create', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return section when created with success', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json({ name: 'Introduction' })
      .loginAs(course.owner)

    response.assertStatus(201)
    response.assertBodyContains({ data: { section: { name: 'Introduction' } } })
  })

  test('should return unauthorized when user not course owner', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()
    const user = await UserFactory.create()

    const response = await client
      .post(`api/v1/courses/${course.id}/sections`)
      .json({ name: 'Introduction' })
      .loginAs(user)

    response.assertStatus(403)
  })
})
