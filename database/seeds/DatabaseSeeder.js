'use strict'
const Database = use('Database')

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const config = {
  rooms: require('./raw/rooms.json'),
  users: require('./raw/users.json'),
  files: require('./raw/files.json'),
  messages: require('./raw/messages.json'),
}

class DatabaseSeeder {
  async run() {
    const seeds = Object.entries(config);
    const now = new Date();

    for (let seed of seeds) {
      const [table, data] = seed;
      for(let row of data) {
        await Database.table(table).insert({ ...row, created_at: now, updated_at: now });
      }
    }
  }
}

module.exports = DatabaseSeeder
