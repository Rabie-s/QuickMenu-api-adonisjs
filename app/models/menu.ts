import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Category from '#models/category'
  
export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare cover_image: string

  @column()
  declare userId: number

  @column()
  declare is_available: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>

  @beforeCreate()
  static async checkIFUserReachMenuLimit(menu: Menu) {


    const user = await menu.related('user').query()
      .preload('UserSubscription', (q) => {
        q.preload('subscription')
      })
      .firstOrFail()

    const userSubscription = user.UserSubscription
    const menuLimit = userSubscription?.subscription.menuLimit


    if (!menuLimit) {
      // إذا اشتراك غير محدود أو غير موجود، نسمح بالإنشاء
      return
    }

    const userMenuCount = await user.related('menus').query().count('* as total');

    const total = Number(userMenuCount[0].$extras.total)

    if (total >= menuLimit) {
      throw new Error('You have reached your menu limit')
    }


  }

}