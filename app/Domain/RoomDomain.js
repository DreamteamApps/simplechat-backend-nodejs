/**
 * Domains
 * 
*/
const UserDomain = use('App/Domain/UserDomain')
const MessageDomain = use('App/Domain/MessageDomain')

/**
 * DTO
 * 
*/

/**
 * Models
 * 
*/
const Room = use("App/Models/Room")

/**
 * General
 * 
*/
const SocketEvents = use('App/Enum/SocketEvents')

/**
 * Save the user current room and socket id
 *
 * @param {object} roomConnection
 * @param {string} roomCode
 * @param {integer} userId
*/
module.exports.join = async (roomConnection, roomCode, userId) => {

    const room = await Room.findOrCreate(
        { code: roomCode },
        { code: roomCode }
    )

    room.save();

    const user = await UserDomain.update(userId, {
        room_id: room.id,
        socket_id: roomConnection.socketId
    });

    const lastMessages = await MessageDomain.getRoomLastMessages(room.id, 10);

    roomConnection.emitToSelf(SocketEvents.SERVER_USER_JOINED_ROOM, {
        user,
        lastMessages
    });

    roomConnection.setRoomId(room.id);

    roomConnection.emit(SocketEvents.SERVER_USER_JOINED_ROOM, {
        user
    });

    roomConnection.join(room.id);
}

/**
 * Emits recent played to all connected clients when a client connect
*/
module.exports.clientConnect = async (room) => {
    room.emitToAll(SocketEvents.SERVER_TOTAL_ONLINE, {
        total: room.totalConnections()
    });
}

/**
 * Disconnect user
 *
 * @param {object} roomConnection
*/
module.exports.disconnectUser = async (roomConnection) => {
    roomConnection.leave();

    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    await UserDomain.update(user.id, {
        room_id: null,
        socket_id: null
    });

    roomConnection.emit(SocketEvents.SERVER_USER_LEAVED_ROOM, {
        user
    }, roomConnection.id);
}

/**
 * Set user as writing a message
 *
 * @param {object} roomConnection
*/
module.exports.userWritingMessage = async (roomConnection) => {
    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    roomConnection.emit(SocketEvents.SERVER_USER_WRITING_MESSAGE, {
        user
    });
}


/**
 * Send a message to room
 *
 * @param {object} roomConnection
*/
module.exports.sendMessage = async (roomConnection, message, type, fileId) => {
    let user = await UserDomain.getUserBySocketId(roomConnection.socketId);
    if (!user) return;

    const { id } = user;

    const dtoMessage = await MessageDomain.create(id, roomConnection.id(), message, type, fileId);

    roomConnection.emit(SocketEvents.SERVER_USER_SEND_MESSAGE, dtoMessage);
}