/**
 * General
 * 
*/
const Log = use("App/Helpers/Log")

const rooms = {};

module.exports.createRoom = async (socketClient, connection) => {
    let _roomId;

    let room = {
        id: () => _roomId,
        socketId: connection.id,
        join: (roomId) => {
            _roomId = roomId;
            
            connection.join(_roomId);

            Log.devLog(`New client connected ${connection.id}`);
        },
        emit: (eventName, data) => {
            if (!_roomId) return;

            socketClient.to(_roomId).emit(eventName, data);

            Log.devLog(`Emited ${eventName} to room ${_roomId}`, data ? JSON.stringify(data, null, 2) : '');
        },
        emitToAll: (eventName, data) => {

            socketClient.emit(eventName, data);

            Log.Log.devLog(`Emited ${eventName} to all`, data ? JSON.stringify(data, null, 2) : '');
        },
        on: (eventName, callback) => {
            connection.on(eventName, (data) => {
                callback(data);

                Log.devLog(`Received ${eventName}`, data ? JSON.stringify(data, null, 2) : '');
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