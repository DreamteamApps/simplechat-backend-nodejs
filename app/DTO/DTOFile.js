class DTOFile {
    constructor(fileModel) {
        const { id, name, extension, duration, url, thumbnail_url } = fileModel;

        this.id = id;
        this.name = name;
        this.extension = extension;
        this.duration = duration;
        this.url = url;
        this.thumbnailUrl = thumbnail_url;
    }
}

module.exports = DTOFile;