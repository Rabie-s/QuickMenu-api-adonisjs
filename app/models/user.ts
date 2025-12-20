import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { afterSave, BaseModel, beforeCreate, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Menu from '#models/menu'
import UserSubscription from '#models/user_subscription'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare phoneNumber: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasMany(() => Menu)
  declare menus: HasMany<typeof Menu>

  @hasOne(() => UserSubscription)
  declare UserSubscription: HasOne<typeof UserSubscription>

  @afterSave()
  static async registerPlan(user: User) {
    //if (!user.$isNew) return
    const trx = user.$trx
    await user.related('UserSubscription').create({
      userId: user.id,
      subscriptionId: 1,
      startsAt: DateTime.now(),
    }, { client: trx })
  }


}