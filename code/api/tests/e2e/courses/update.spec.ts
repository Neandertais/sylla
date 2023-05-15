import Database from '@ioc:Adonis/Lucid/Database'
import { file } from '@ioc:Adonis/Core/Helpers'
import { test } from '@japa/runner'

import UserFactory from 'Database/factories/UserFactory'
import CourseFactory from 'Database/factories/CourseFactory'

test.group('Courses - update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return course with updated properties', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()

    const banner = await file.generateJpg('2mb')

    const response = await client
      .patch(`/api/v1/courses/${course.id}`)
      .file('banner', banner.contents, { filename: banner.name })
      .fields({ name: 'Javascript Object Oriented', price: 15.9 })
      .loginAs(course.owner)

    response.assertStatus(200)
    response.assertBodyContains({
      data: { course: { name: 'Javascript Object Oriented', price: 15.9 } },
    })
  })

  test('should return error when name or price not submitted', async ({ client }) => {
    const course = await CourseFactory.with('owner').create()

    const response = await client
      .patch(`/api/v1/courses/${course.id}`)
      .json({ name: 'Javascript Object Oriented', price: 15.9, banner: null })
      .loginAs(course.owner)

    response.assertStatus(200)
    response.assertBodyContains({
      data: { course: { name: 'Javascript Object Oriented', price: 15.9, bannerUrl: null } },
    })
  })

  test('should return not found course not exits', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.patch('/api/v1/courses/any').loginAs(user)

    response.assertStatus(404)
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const response = await client.patch('/api/v1/courses/any')

    response.assertStatus(401)
  })
})
