import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'social_links'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('username').references('username').inTable('users').onDelete('CASCADE')
      table.string('website')
      table.string('youtube')
      table.string('instagram')
      table.string('twitter')
      table.string('facebook')
      table.string('linkedin')
      table.string('tiktok')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
