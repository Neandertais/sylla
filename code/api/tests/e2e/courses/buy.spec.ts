import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import CourseFactory from 'Database/factories/CourseFactory'
import UserFactory from 'Database/factories/UserFactory'

test.group('Courses - buy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return status created when successful', async ({ client }) => {
    const user = await UserFactory.create()
    const course = await CourseFactory.with('owner').create()

    const response = await client.post(`api/v1/courses/${course.id}/buy`).loginAs(user)

    response.assertStatus(201)
  })

  test("should increase the owner's money and decrease the buyer's", async ({ client, assert }) => {
    const user = await UserFactory.create()
    const course = await CourseFactory.with('owner').create()

    const prevUserCash = user.cash
    const prevOwnerCash = course.owner.cash

    const response = await client.post(`api/v1/courses/${course.id}/buy`).loginAs(user)

    await user.refresh()
    await course.owner.refresh()

    const postUserCash = user.cash
    const postOwnerCash = course.owner.cash

    response.assertStatus(201)

    assert.equal(prevUserCash - course.price, postUserCash)
    assert.equal(prevOwnerCash + course.price, postOwnerCash)
  })

  test('should return an bad request when the course owner tries to purchase it', async ({
    client,
  }) => {
    const course = await CourseFactory.with('owner').create()

    const response = await client.post(`api/v1/courses/${course.id}/buy`).loginAs(course.owner)

    response.assertStatus(403)
  })

  test('should return not found when course not exists', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.post('api/v1/courses/any/buy').loginAs(user)

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'course not found' }] })
  })

  test('should return bad request when user does not have enough money', async ({ client }) => {
    // When creating a user you get 50 money
    const user = await UserFactory.create()
    const course = await CourseFactory.with('owner').merge({ price: 100 }).create()

    const response = await client.post(`api/v1/courses/${course.id}/buy`).loginAs(user)

    response.assertStatus(400)
    response.assertBody({ errors: [{ message: 'insufficient money' }] })
  })

  test('should return unauthorized when user not logged in', async ({ client }) => {
    const course = await CourseFactory.with('owner').merge({ price: 100 }).create()

    const response = await client.post(`api/v1/courses/${course.id}/buy`)

    response.assertStatus(401)
  })
})
