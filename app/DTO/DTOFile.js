class DTOFile {
    constructor(fileModel) {
        const { id, name, extension, duration_seconds, url, thumbnail_url } = fileModel;

        this.id = id;
        this.name = name;
        this.extension = extension;
        this.duration = duration_seconds;
        this.url = url;
        this.thumbnailUrl = thumbnail_url;
    }
}

module.exports = DTOFile;