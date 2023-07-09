import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.specificType(
        'fts',
        "tsvector GENERATED ALWAYS AS (to_tsvector('portuguese', name || ' ' || description )) STORED"
      )

      table.index('fts', 'fts_index', 'GIN')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fts')
      table.dropIndex('fts_index')
    })
  }
}
