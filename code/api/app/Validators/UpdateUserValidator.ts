import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string.optional([
      rules.trim(),
      rules.minLength(6),
      rules.maxLength(56),
      rules.alphaNum({ allow: ['underscore'] }),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    name: schema.string.optional([rules.trim(), rules.minLength(6), rules.maxLength(80)]),
    profession: schema.string.optional([rules.trim(), rules.minLength(4), rules.maxLength(80)]),
    biography: schema.string.optional([rules.minLength(12), rules.maxLength(360)]),
    avatar: schema.file.nullableAndOptional({ size: '10mb', extnames: ['jpg', 'png', 'webp'] }),
    socialLinks: schema.object.optional().members({
      website: schema.string.optional([rules.url()]),
      youtube: schema.string.optional([rules.url()]),
      instagram: schema.string.optional([rules.url()]),
      twitter: schema.string.optional([rules.url()]),
      facebook: schema.string.optional([rules.url()]),
      linkedin: schema.string.optional([rules.url()]),
      tiktok: schema.string.optional([rules.url()]),
    }),
  })

  public messages: CustomMessages = {}
}
