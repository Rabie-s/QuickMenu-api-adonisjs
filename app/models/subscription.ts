import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import UserSubscription from '#models/user_subscription'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare price: number

  @column()
  declare menuLimit: number | null

  @column()
  declare showAds: boolean

  @column()
  declare durationDays: number | null

  @column()
  declare isAvailable: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => UserSubscription)
  declare users: HasMany<typeof UserSubscription>


}