/**
 * DTO
 * 
*/
const DTOUser = use('App/DTO/DTOUser');
const DTOFile = use('App/DTO/DTOFile');

class DTOMessage {
    constructor(messageModel) {
        const { id, type, message, created_at, user, file } = messageModel;

        this.id = id;
        this.type = type;
        this.message = message;
        this.date = created_at;
        this.user = new DTOUser(user);

        if(file) {
            this.file = new DTOFile(file);
        }
    }
}

module.exports = DTOMessage;