import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo, hasMany } from '@adonisjs/lucid/orm'
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

  @belongsTo(()=>User)
  declare user: typeof User

  @hasMany(()=>Category)
  declare categories:typeof Category

}