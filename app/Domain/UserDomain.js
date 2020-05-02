const User = use("App/Models/User")

const GitHub = use("App/Infrastructure/Github")

/**
 * Get user by id
 *
 * @param {string} userId
*/
module.exports.getUserById = async (userId) => {
    const user = await User.findBy('id', userId);
    return user;
}

/**
 * Sets the socketId of userId
 *
 * @param {integer} userId
 * @param {string} socketId
*/
module.exports.setUserSocketId = async (userId, socketId) => {
    const user = await User.findBy('id', userId);

    user.merge({
        socket_id: socketId
    });

    user.save();
}

/**
 * Get user by socketId
 *
 * @param {string} socketId
*/
module.exports.getUserBySocketId = async (socketId) => {
    const user = await User.findBy('socket_id', socketId);
    return user;
}