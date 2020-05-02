'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Room extends Model {
    messages() {
        return this.hasMany('App/Models/Message', 'id', 'room_id');
    }
}

module.exports = Room
