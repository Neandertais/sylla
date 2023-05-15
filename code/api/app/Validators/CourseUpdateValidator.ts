import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CourseUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string.optional([rules.trim(), rules.minLength(12), rules.maxLength(120)]),
    description: schema.string.optional([rules.minLength(20), rules.maxLength(560)]),
    willLearn: schema.array.optional().members(schema.string([rules.trim()])),
    price: schema.number.optional(),
    banner: schema.file.nullableAndOptional({ size: '10mb', extnames: ['jpg', 'png', 'webp'] }),
  })

  public messages: CustomMessages = {}
}
