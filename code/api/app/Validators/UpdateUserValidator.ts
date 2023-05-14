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
    name: schema.string.nullableAndOptional([
      rules.trim(),
      rules.minLength(6),
      rules.maxLength(80),
    ]),
    profession: schema.string.nullableAndOptional([
      rules.trim(),
      rules.minLength(4),
      rules.maxLength(80),
    ]),
    biography: schema.string.nullableAndOptional([rules.minLength(12), rules.maxLength(360)]),
    avatar: schema.file.nullableAndOptional({ size: '10mb', extnames: ['jpg', 'png', 'webp'] }),
    socialLinks: schema.object.optional().members({
      website: schema.string.nullableAndOptional([rules.url()]),
      youtube: schema.string.nullableAndOptional([rules.url()]),
      instagram: schema.string.nullableAndOptional([rules.url()]),
      twitter: schema.string.nullableAndOptional([rules.url()]),
      facebook: schema.string.nullableAndOptional([rules.url()]),
      linkedin: schema.string.nullableAndOptional([rules.url()]),
      tiktok: schema.string.nullableAndOptional([rules.url()]),
    }),
  })

  public messages: CustomMessages = {}
}
