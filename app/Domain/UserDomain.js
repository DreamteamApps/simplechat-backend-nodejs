
/**
 * DTO
 * 
*/
const DTOUser = use('App/DTO/DTOUser');

/**
 * Models
 * 
*/
const User = use("App/Models/User")

/**
 * Gets or creates user
 *
 * @param {string} username
*/
module.exports.getOrCreateUser = async (username) => {
    const userModel = await User.findOrCreate(
        { username: username },
        { username: username }
    )

    return new DTOUser(userModel);
}

/**
 * Updates user
 *
 * @param {integer} userId
 * @param {object} fields
*/
module.exports.update = async (userId, fields) => {
    const userModel = await User.findBy('id', userId);

    userModel.merge(fields);

    userModel.save();

    return new DTOUser(userModel);
}

/**
 * Get user by id
 *
 * @param {string} userId
*/
module.exports.getUserById = async (userId) => {
    const userModel = await User.findBy('id', userId);

    return userModel ? new DTOUser(userModel) : null;
}

/**
 * Get user by socketId
 *
 * @param {string} socketId
*/
module.exports.getUserBySocketId = async (socketId) => {
    const userModel = await User.findBy('socket_id', socketId);

    return userModel ? new DTOUser(userModel) : null;
}