import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('username').primary()
      table.string('name')
      table.string('avatar')
      table.string('biography')
      table.string('profession')
      table.integer('cash').unsigned()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
