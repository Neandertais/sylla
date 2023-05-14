import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserCheckValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional([
      rules.trim(),
      rules.minLength(6),
      rules.maxLength(56),
      rules.alphaNum({ allow: ['underscore'] }),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string.optional([
      rules.trim(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
  })

  public messages: CustomMessages = {}
}
