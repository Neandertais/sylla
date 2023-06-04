import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'videos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 21).primary()
      table.string('name', 240)
      table.string('description', 5_000)
      table.integer('position').unsigned()

      table.string('section_id', 21).references('sections.id')

      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
