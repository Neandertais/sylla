import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SigninValidator from 'App/Validators/SigninValidator'
import SignupValidator from 'App/Validators/SignupValidator'

import User from 'App/Models/User'

export default class AuthController {
  public async signin({ auth, request, response }: HttpContextContract) {
    const { usernameOrEmail, password } = await request.validate(SigninValidator)

    const { user, token } = await auth.use('api').attempt(usernameOrEmail, password)

    response.ok({ data: { user, token } })
  }

  public async signup({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(SignupValidator)

    payload.username = payload.username.toLowerCase()

    const user = await User.create(payload)
    const { token } = await auth.use('api').generate(user)

    return response.created({
      data: {
        user,
        token,
      },
    })
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()

    return response.noContent()
  }
}
