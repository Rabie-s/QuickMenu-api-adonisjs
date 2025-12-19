import type { HttpContext } from '@adonisjs/core/http'
import { registerUserValidator } from '#validators/auth'
import AuthService from '#services/auth_service'

export default class AuthController {

  async register({ request, response }: HttpContext) {

    const validatedData = await request.validateUsing(registerUserValidator)
    await AuthService.register(validatedData)
    response.created({ message: 'User created successfully' })

  }

  async login({ request, response }: HttpContext) {

    const { email, password } = request.only(['email', 'password'])
    const user = await AuthService.login(email, password)
    return response.ok(user)
  }

  async logout({ auth, response }: HttpContext) {

    const user = auth.user!
    const token = user.currentAccessToken!
    await AuthService.logout(user, token.identifier)
    return response.ok({ message: 'Logout successfully' });
  }

  async me({ auth, response }: HttpContext) {
    return response.ok(auth.user);
  }



}