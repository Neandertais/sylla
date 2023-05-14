import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignupValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([
      rules.trim(),
      rules.minLength(6),
      rules.maxLength(56),
      rules.alphaNum({ allow: ['underscore'] }),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string([
      rules.trim(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string([rules.trim(), rules.minLength(8)]),
  })

  public messages: CustomMessages = {}
}
