import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CourseCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([rules.trim(), rules.minLength(12), rules.maxLength(120)]),
    description: schema.string.optional([rules.minLength(20), rules.maxLength(560)]),
    willLearn: schema.array.optional().members(schema.string([rules.trim()])),
    price: schema.number(),
    keywords: schema.array().members(schema.string([rules.alpha()])),
    banner: schema.file.optional({ size: '10mb', extnames: ['jpg', 'png', 'webp'] }),
  })

  public messages: CustomMessages = {}
}
