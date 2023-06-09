import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

import User from "App/Models/User";

export default class AuthenticationController {
  public async signUp({ auth, request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      username: schema.string([
        rules.trim(),
        rules.minLength(6),
        rules.maxLength(56),
      ]),
      email: schema.string([rules.trim(), rules.email()]),
      password: schema.string([
        rules.trim(),
        rules.minLength(8),
        rules.confirmed(),
      ]),
    });

    try {
      const payload = await request.validate({ schema: newUserSchema });

      // Check if user already exists
      if (await User.find(payload.username.toLowerCase())) {
        return response.conflict({ error: "Username already used" });
      }

      if (await User.findBy("email", payload.email.toLowerCase())) {
        return response.conflict({ error: "Email already used" });
      }

      // Save user and authenticate
      const user = await User.create(payload);
      const token = await auth.use("api").generate(user);

      return response.created({ user, token });
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async signIn({ auth, request, response }: HttpContextContract) {
    const userLoginSchema = schema.create({
      username: schema.string.optional([
        rules.trim(),
        rules.minLength(6),
        rules.maxLength(56),
      ]),
      email: schema.string.optional([rules.trim(), rules.email()]),
      password: schema.string([rules.minLength(8)]),
    });

    try {
      const payload = await request.validate({ schema: userLoginSchema });

      // Check if username or email was sent
      if (!payload.email && !payload.username) {
        return response.badRequest({
          errors: [
            {
              rule: "required",
              fields: ["username", "email"],
              message: "required validation failed",
            },
          ],
        });
      }

      // Authenticate user
      const identifier = payload.username || payload.email;
      await auth
        .attempt(identifier!, payload.password)
        .then((token) => {
          return response.ok(token);
        })
        .catch(() => {
          return response.unauthorized({ error: "Invalid credentials" });
        });
    } catch (error) {
      return response.badRequest(error.messages);
    }
  }

  public async logOut({ auth }: HttpContextContract) {
    await auth.use("api").revoke();

    return {
      loggedOut: true,
    };
  }

  public async alreadyUsed({ request, response }: HttpContextContract) {
    const alreadyUsedSchema = schema.create({
      username: schema.string.optional(),
      email: schema.string.optional(),
    });

    try {
      const { username, email } = await request.validate({
        schema: alreadyUsedSchema,
      });

      if (username) {
        const user = await User.find(username);

        if (user) {
          return response.conflict({ field: "username" });
        }

        return response.noContent();
      }

      if (email) {
        const user = await User.findBy("email", email);

        if (user) {
          return response.conflict({ field: "email" });
        }

        return response.noContent();
      }
    } catch (error) {}

    return response.badRequest({ message: "Expected argument" });
  }
}
