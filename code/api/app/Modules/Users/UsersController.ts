import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { randomUUID } from 'node:crypto'

import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import UserCheckValidator from 'App/Validators/UserCheckValidator'

import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UsersController {
  public async show({ auth: { user } }: HttpContextContract) {
    return {
      data: { user },
    }
  }

  public async check({ request, response }: HttpContextContract) {
    await request.validate(UserCheckValidator)

    return response.noContent()
  }

  public async find({ params: { username }, response }: HttpContextContract) {
    const user = await User.query().where('username', username).preload('socialLinks').first()

    if (!user) {
      return response.notFound({ errors: [{ message: 'user not found' }] })
    }

    const [{ students }, { evaluations }] = await Promise.all([
      Database.query()
        .from('users')
        .count('*', 'students')
        .join('courses', 'users.username', 'courses.owner_id')
        .join('course_students', 'course_students.course_id', 'courses.id')
        .where('users.username', user.username)
        .first(),
      Database.query()
        .from('users')
        .count('*', 'evaluations')
        .join('courses', 'users.username', 'courses.owner_id')
        .join('course_ratings', 'course_ratings.course_id', 'courses.id')
        .where('users.username', user.username)
        .first(),
    ])
    return {
      data: { user: { ...user.serialize({ fields: { omit: ['cash'] } }), students, evaluations } },
    }
  }

  public async update({ params: { username }, bouncer, request, response }: HttpContextContract) {
    const user = await User.query().where('username', username).preload('socialLinks').first()

    if (!user) {
      return response.notFound({ errors: [{ message: 'user not found' }] })
    }

    await bouncer.authorize('updateUser', user)

    const payload = await request.validate(UpdateUserValidator)

    if (payload.avatar) {
      const filename = `${randomUUID()}.${payload.avatar.extname}`

      await payload.avatar.move(Application.tmpPath('uploads'), { name: filename })

      payload.avatar = filename as any
    }

    if (payload.avatar === null) {
      user.avatar && (await Drive.delete(Application.tmpPath('uploads', user.avatar)))
    }

    await user.socialLinks.merge(payload?.socialLinks as any).save()
    await user.merge(payload as any).save()

    return { data: { user } }
  }
}
