import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CourseRatingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    rate: schema.number([rules.unsigned(), rules.range(0.5, 5)]),
  })

  public messages: CustomMessages = {}
}
