import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import CourseFactory from 'Database/factories/CourseFactory'

test.group('Courses - find', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return course', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()

    const response = await client.get(`/api/v1/courses/${course.id}`)

    response.assertStatus(200)
  })

  test('should return not found when course not exists', async ({ client }) => {
    const response = await client.get('/api/v1/courses/any')

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'course not found' }] })
  })
})
