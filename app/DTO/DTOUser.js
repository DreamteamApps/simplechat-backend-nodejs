class DTOUser {
    constructor(userModel) {
        const { id, username } = userModel;

        this.id = id;
        this.username = username;
    }
}

module.exports = DTOUser;