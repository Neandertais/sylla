import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 21).primary()
      table.string('name', 120)
      table.string('description', 560)
      table.float('price')
      table.string('will_learn', 840)
      table.string('banner', 48)

      table.string('owner_id', 56).references('users.username').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
