import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import VideoFactory from 'Database/factories/VideoFactory'

test.group('Videos - find', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return video', async ({ client }) => {
    const video = await VideoFactory.create()

    const response = await client.get(`/api/v1/videos/${video.id}`)

    response.assertStatus(200)
  })

  test('should return not found when video not exists', async ({ client }) => {
    const response = await client.get('/api/v1/videos/any')

    response.assertStatus(404)
    response.assertBody({ errors: [{ message: 'video not found' }] })
  })
})
