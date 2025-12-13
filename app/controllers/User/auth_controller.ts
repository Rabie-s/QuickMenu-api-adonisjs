import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {

  async register({ request, response }: HttpContext) {

    const validatedData = await request.validateUsing(registerUserValidator)
    await User.create(validatedData)
    response.created({ message: 'User created successfully' })

  }

  async login({ request, response }: HttpContext) {

    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    // Delete existing tokens

    const token = await User.accessTokens.create(user)
    return response.ok({
      user: user,
      token: token.value?.release()
    })
  }

  async logout({ auth, response }: HttpContext) {

    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return response.ok(auth.user);
  }

  async me({ auth, response }: HttpContext) {
    return response.ok(auth.user);
  }

  async test({ response }: HttpContext) {
    const users = await User.all()
    //return response.status(500).json({ error: "Something went wrong" });
    return await new Promise((resolve) => setTimeout(() => resolve(users), 2000));

  }


}