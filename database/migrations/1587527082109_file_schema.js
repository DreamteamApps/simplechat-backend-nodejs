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
      table.string('mimeType', 254)
      table.string('path', 1000)
      table.string('duration', 20)
      table.timestamps()
    })
  }

  down() {
    this.drop('files')
  }
}

module.exports = FilesSchema
