import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import Drive from '@ioc:Adonis/Core/Drive'
import { randomUUID } from 'node:crypto'

import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import UserCheckValidator from 'App/Validators/UserCheckValidator'

import User from 'App/Models/User'

export default class UsersController {
  public async index({ auth: { user } }: HttpContextContract) {
    return { data: user };
  }

  public async show({ params: { username }, response }: HttpContextContract) {
    const user = await User.find(username);

    if (!user) {
      return response.notFound({ errors: [{ message: 'user not found' }] })
    }

    return { data: user };
  }

  public async update({ params: { username }, bouncer, request, response }: HttpContextContract) {
    const user = await User.query().where('username', username).preload('socialLinks').first()

    if (!user) {
      return response.notFound({ errors: [{ message: 'user not found' }] })
    }

    const updateUserSchema = schema.create({
      username: schema.string.optional([
        rules.trim(),
        rules.minLength(6),
        rules.maxLength(56),
      ]),
      name: schema.string.optional([rules.minLength(6), rules.maxLength(80)]),
      profession: schema.string.optional([
        rules.minLength(4),
        rules.maxLength(80),
      ]),
      biography: schema.string.optional([
        rules.minLength(12),
        rules.maxLength(360),
      ]),
      social_links: schema.array.optional().members(
        schema.object().members({
          platform: schema.enum(Object.values(Platforms)),
          link: schema.string([rules.url()]),
        })
      ),
    });

    try {
      const payload = await request.validate({ schema: updateUserSchema });

      // Check if the username is already in use
      if (payload.username) {
        const user = await User.find(payload.username?.toLowerCase());
        if (user) {
          return response.conflict({ error: "Username is already in use" });
        }
      }

      // Merge payload with user
      user?.merge(payload);

      // Upload avatar image
      const avatar = request.file("avatar", {
        size: "10mb",
        extnames: ["jpg", "png", "webp"],
      });

      if (avatar?.isValid) {
        const filename = `${nanoid()}.${avatar.extname}`;

        await avatar.moveToDisk("./", {
          name: filename,
        });

        // TODO - remove image

        user?.merge({ avatar: filename });
      }

      await user?.save();

      return { data: user };
    } catch (error) {
      return response.badRequest(error.messages);
    }

    if (payload.avatar === null) {
      user.avatar && (await Drive.delete(Application.tmpPath('uploads', user.avatar)))
    }

    await user.socialLinks.merge(payload?.socialLinks as any).save()
    await user.merge(payload as any).save()

    return { data: { user } }
  }
}
