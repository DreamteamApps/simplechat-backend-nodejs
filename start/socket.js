/**
 * Server
 * 
*/
const env = use('Env')
const Server = use('Server')
const socketConnection = use('socket.io')(Server.getInstance(), { pingInterval: 5000, pingTimeout: 10000 });

/**
 * Domains
 * 
*/
const RoomDomain = use('App/Domain/RoomDomain')

/**
 * General
 * 
*/
const SocketEvents = use('App/Enum/SocketEvents')

socketConnection.on('connection', async (connection) => {
    const room = await createRoom(connection);

    room.on(SocketEvents.CLIENT_JOIN_ROOM, async (params) => {
        const { username } = params;
        const roomCode = 'sala-teste';

        RoomDomain.join(room, roomCode, username);
    });

    room.on(SocketEvents.CLIENT_WRITING_MESSAGE, async () => {
        RoomDomain.userWritingMessage(room);
    });

    room.on(SocketEvents.CLIENT_SEND_MESSAGE, async (params) => {
        const { message, type, fileId } = params;
        
        RoomDomain.sendMessage(room, message, type, fileId);
    });

    room.on(SocketEvents.CLIENT_LEAVE_ROOM, async () => {
        RoomDomain.disconnectUser(room);
    });

    room.on(SocketEvents.CLIENT_DISCONNECT, async () => {
        RoomDomain.disconnectUser(room);
    });
});

const rooms = {};
const createRoom = async (connection) => {
    let _roomId;

    let room = {
        socketId: connection.id,
        roomId: () => _roomId,
        join: (roomId) => {
            _roomId = roomId;
            
            connection.join(_roomId);

            devLog(`New client connected ${connection.id}`);
        },
        emit: (eventName, data) => {
            if (!_roomId) return;

            socketConnection.to(_roomId).emit(eventName, data);

            devLog(`Emited ${eventName} to room ${_roomId}`, data ? JSON.stringify(data, null, 2) : '');
        },
        on: (eventName, callback) => {
            connection.on(eventName, (data) => {
                callback(data);

                devLog(`Received ${eventName}`, data ? JSON.stringify(data, null, 2) : '');
            });
        },
        leave: () => {
            if (!_roomId) return;

            connection.leave(_roomId);

            rooms[connection.id] = null;
        }
    }

    rooms[connection.id] = room;

    return rooms[connection.id];
}

const devLog = (...args) => {
    if (process.env.NODE_ENV == "development") {
        console.log(...args);
    }
}