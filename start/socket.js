/**
 * Server
 * 
*/
const Server = use('Server')
const socketClient = use('socket.io')(Server.getInstance());

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
const Socket = use("App/Helpers/Socket")

socketClient.on('connection', async (connection) => {
    const room = await Socket.createRoom(socketClient, connection);

    room.on(SocketEvents.CLIENT_JOIN_ROOM, async ({ userId }) => RoomDomain.join(room, 'sala-teste', userId));

    room.on(SocketEvents.CLIENT_WRITING_MESSAGE, async () => RoomDomain.userWritingMessage(room));

    room.on(SocketEvents.CLIENT_SEND_MESSAGE, async ({ message, type, fileId }) => RoomDomain.sendMessage(room, message, type, fileId));

    room.on(SocketEvents.CLIENT_LEAVE_ROOM, async () => RoomDomain.disconnectUser(room));

    room.on(SocketEvents.CLIENT_DISCONNECT, async () => RoomDomain.disconnectUser(room));
});