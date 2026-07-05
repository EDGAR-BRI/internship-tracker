import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class GoogleAuthController {
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async callback({ ally, response }: HttpContext) {
    const provider = ally.use('google')

    if (provider.hasError()) {
      return response.badRequest({ error: provider.getError() })
    }

    const googleUser = await provider.user()

    let user = await User.query()
      .where('email', googleUser.email)
      .orWhere('provider_id', googleUser.id)
      .first()

    if (user) {
      if (!user.provider) {
        user.provider = 'google'
        user.providerId = googleUser.id
        await user.save()
      }
    } else {
      user = await User.create({
        fullName: googleUser.name,
        email: googleUser.email,
        provider: 'google',
        providerId: googleUser.id,
      })
    }

    const token = await User.accessTokens.create(user)

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      token: token.value!.release(),
    }
  }
}
