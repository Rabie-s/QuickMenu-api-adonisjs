import { DateTime } from 'luxon'
import type { BelongsTo,HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Menu from '#models/menu'
import MenuItem from '#models/menu_item'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare menuId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Menu)
  declare menu: BelongsTo<typeof Menu>

  @hasMany(() => MenuItem)
  declare menuItems: HasMany<typeof MenuItem>
}
