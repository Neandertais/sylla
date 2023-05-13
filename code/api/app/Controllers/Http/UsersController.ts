import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async create({}: HttpContextContract) {
    await User.create({
      username: 'grilario',
      email: 'hello',
      password: 'turuur',
    })

    console.log(await User.all())

    return {
      hello: 'oi',
    }
  }
}
