/**
 * Models
 * 
*/
const Database = use('Database')
const Room = use("App/Models/Room")
const User = use("App/Models/User")
const Message = use("App/Models/Message")

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
 * @param {string} username
*/
module.exports.join = async (roomConnection, roomCode, username) => {

    let room = await Room.findBy('code', roomCode);
    if (!room) {
        await Room.create({ code: roomCode });
        room = await Room.findBy('code', roomCode);
    }

    let user = await User.findBy('username', username);
    if (!user) {
        await User.create({
            username: username,
            room_id: room.id,
            socket_id: roomConnection.socketId
        });
    } else {
        user.merge({
            room_id: room.id,
            socket_id: roomConnection.socketId
        });
        user = user.save();
    }

    room.save();

    roomConnection.join(room.id);

    const lastMessagesFromDB = await room.messages().with('user').with('file').orderBy('id', 'desc').limit(10).fetch();
    const lastMessages = lastMessagesFromDB.toJSON().map(({ type, message, user, file }) => {
        const dtoMessage = {
            type,
            message,
            user: {
                id: user.id,
                username: user.username
            }
        }

        if (file) {
            dtoMessage.file = {
                id: file.id,
                name: file.name,
                extension: file.extension
            }
        }

        return dtoMessage;
    });

    roomConnection.emit(SocketEvents.SERVER_USER_JOINED_ROOM, {
        id: user.id,
        username,
        lastMessages
    });
}

/**
 * Disconnect user
 *
 * @param {object} roomConnection
*/
module.exports.disconnectUser = async (roomConnection) => {
    let user = await User.findBy('socket_id', roomConnection.socketId);
    if (user) {

        const { username } = user;
        roomConnection.emit(SocketEvents.SERVER_USER_LEAVED_ROOM, {
            id: user.id,
            username
        }, user.room_id);

        user.merge({
            room_id: null,
            socket_id: ""
        });

        user.save();
    }

    roomConnection.leave();
}

/**
 * Set user as writing a message
 *
 * @param {object} roomConnection
*/
module.exports.userWritingMessage = async (roomConnection) => {
    let user = await User.findBy('socket_id', roomConnection.socketId);

    roomConnection.emit(SocketEvents.SERVER_USER_WRITING_MESSAGE, {
        id: user.id,
        username: user.username
    });
}


/**
 * Send a message to room
 *
 * @param {object} roomConnection
*/
module.exports.sendMessage = async (roomConnection, message, type, fileId) => {
    let user = await User.findBy('socket_id', roomConnection.socketId);
    if (user) {
        const newMessage = await Message.create({
            user_id: user.id,
            room_id: roomConnection.roomId(),
            type: type,
            message: message,
            file_id: fileId
        });

        const dtoMessage = {
            type: newMessage.type,
            message: newMessage.message,
            user: {
                id: user.id,
                username: user.username
            },

        }

        // const file = await newMessage.file().fetch();
        // if (file) {
        //     dtoMessage.file = {
        //         id: file.id,
        //         name: file.name,
        //         extension: file.extension
        //     }
        // }

        roomConnection.emit(SocketEvents.SERVER_USER_SEND_MESSAGE, dtoMessage);
    }
}