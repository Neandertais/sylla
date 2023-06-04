import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideoUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional([rules.minLength(6), rules.maxLength(100)]),
    description: schema.string.optional([rules.maxLength(5_000)]),
  })

  public messages: CustomMessages = {}
}
