import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VideoUpdateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    videoBefore: schema.string.nullable([rules.minLength(21), rules.maxLength(21)]),
  })

  public messages: CustomMessages = {}
}
