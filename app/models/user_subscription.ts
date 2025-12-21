import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Subscription from '#models/subscription'
import  {SubscriptionStatus}  from '../enums/subscription_status.js'

export default class UserSubscription extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare subscriptionId: number

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare status: SubscriptionStatus

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Subscription)
  declare subscription: BelongsTo<typeof Subscription>
}