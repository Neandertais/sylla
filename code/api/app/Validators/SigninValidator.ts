import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SigninValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    usernameOrEmail: schema.string([rules.trim()]),
    password: schema.string([rules.trim(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {}
}
