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

    const messageModel = await Message.create({
        user_id,
        room_id,
        message,
        type,
        file_id
    });

    return new DTOMessage(messageModel);
}

/**
 * Returns x messages from given room id
 *
 * @param {integer} roomId
 * @param {integer} quantity
*/
module.exports.getRoomLastMessages = async (roomId, quantity) => {
    
    const messagesModel = await Message.query().where('room_id', roomId).orderBy('created_at', 'desc').with('user').with('file').limit(quantity).fetch();

    return messagesModel.toJSON().map(message => new DTOMessage(message));
}