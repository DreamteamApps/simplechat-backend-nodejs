'use strict'

/**
 * Domains
 * 
*/
const UserDomain = use('App/Domain/UserDomain')

class UserController {

    /**
     * Gets or creates user
     *
     * @param {string} request.body.username
    */
    async create({ request }) {
        const { username } = request.only(['username']);

        return await UserDomain.getOrCreateUser(username);
    }
}

module.exports = UserController
