/**
 * DTO
 * 
*/
const DTOMessage = use('App/DTO/DTOMessage')

/**
 * Models
 * 
*/
const Message = use("App/Models/Message")


/**
 * Creates a new message to a room
 *
 * @param {string} username
*/
module.exports.create = async (user_id, room_id, message, type, file_id) => {

    const createdMessage = await Message.create({
        user_id,
        room_id,
        message,
        type,
        file_id
    });

    return await module.exports.getById(createdMessage.id);
}

/**
 * Returns x messages from given room id
 *
 * @param {integer} roomId
 * @param {integer} quantity
*/
module.exports.getRoomLastMessages = async (roomId, quantity) => {
    
    const messagesModel = await Message.query().with('user').with('file').where('room_id', roomId).orderBy('created_at', 'desc').limit(quantity).fetch();

    return messagesModel.toJSON().map(message => new DTOMessage(message));
}

/**
 * Get message by id
 *
 * @param {string} messageId
*/
module.exports.getById = async (messageId) => {

    const messageModel = await Message.query().with('user').with('file').where('id', messageId).first();

    return new DTOMessage(messageModel.toJSON());
}