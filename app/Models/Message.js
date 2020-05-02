'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Message extends Model {
  room() {
    return this.hasOne('App/Models/Room', 'room_id', 'id');
  }

  user() {
    return this.hasOne('App/Models/User', 'user_id', 'id');
  }

  file() {
    return this.hasOne('App/Models/File', 'file_id', 'id');
  }
}

module.exports = Message
