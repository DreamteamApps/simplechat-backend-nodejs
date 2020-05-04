class DTOFile {
    constructor(fileModel) {
        const { id, name, extension, duration } = fileModel;

        this.id = id;
        this.name = name;
        this.extension = extension;
        this.duration = duration;
    }
}

module.exports = DTOFile;