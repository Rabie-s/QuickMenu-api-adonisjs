import User from '#models/user'
export default class AuthService {

    static async register(data: any) {
        return await User.create(data)
    }

    static async login(email: string, password: string) {
        const user = await User.verifyCredentials(email, password)

        // 🔐 Revoke previous tokens
        //await User.accessTokens.deleteAll(user)

        const token = await User.accessTokens.create(user)

        return {
            user,
            token: token.value!.release(),
        }
    }

    static async logout(user: User, tokenId: string) {
        await User.accessTokens.delete(user, tokenId)
    }

}