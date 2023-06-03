import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('username', 56).primary()
      table.string('name', 80)
      table.string('avatar', 48)
      table.string('biography', 360)
      table.string('profession', 80)
      table.decimal('cash', 18, 2).unsigned()
      table.string('email', 320).notNullable().unique()
      table.string('password', 180).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
