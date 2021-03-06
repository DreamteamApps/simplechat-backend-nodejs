'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).unique()
      table.string('password', 60)
      
      table.string('username', 80)
      table.integer('room_id').unsigned().references('id').inTable('rooms')
      table.string('socket_id', 254).defaultTo('')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
