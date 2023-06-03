import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import CourseFactory from 'Database/factories/CourseFactory'
import SectionFactory from 'Database/factories/SectionFactory'

test.group('Sections - list', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return list sections objects', async ({ client }) => {
    const course = await CourseFactory.create()
    await SectionFactory.merge([
      { position: 1, courseId: course.id },
      { position: 2, courseId: course.id },
      { position: 3, courseId: course.id },
    ]).createMany(3)

    const response = await client.get(`api/v1/courses/${course.id}/sections`)

    response.assertStatus(200)
  })
})
