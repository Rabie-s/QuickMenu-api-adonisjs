import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      
      table.string('title').notNullable()
      table.text('description').nullable()

      table.decimal('price', 10, 2).notNullable().defaultTo(0)

      table.integer('menu_limit').nullable() // NULL = unlimited
      table.boolean('show_ads').notNullable().defaultTo(true)

      table.integer('duration_days').nullable() // NULL = never expires
      table.boolean('is_available').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}