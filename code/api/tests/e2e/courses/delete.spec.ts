import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'
import CourseFactory from 'Database/factories/CourseFactory'

test.group('Courses - delete', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return no content with deleted course', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()

    const response = await client.delete(`/api/v1/courses/${course.id}`).loginAs(course.owner)

    response.assertStatus(204)
  })

  test('should return not found course not exits', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.delete('/api/v1/courses/any').loginAs(user)

    response.assertStatus(404)
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const response = await client.patch('/api/v1/courses/any')

    response.assertStatus(401)
  })
})
