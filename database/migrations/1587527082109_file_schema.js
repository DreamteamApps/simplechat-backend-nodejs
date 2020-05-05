'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FilesSchema extends Schema {
  up() {
    this.create('files', (table) => {
      table.increments()
      table.string('type', 254)
      table.string('name', 254)
      table.string('extension', 254)
      table.string('key', 254)
      table.string('url', 254)
      table.integer('duration_seconds')
      table.timestamps()
    })
  }

  down() {
    this.drop('files')
  }
}

module.exports = FilesSchema
