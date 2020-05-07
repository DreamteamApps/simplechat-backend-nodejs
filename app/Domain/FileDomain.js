/**
 * DTO
 * 
*/
const DTOFile = use('App/DTO/DTOFile')

/**
 * Models
 * 
*/
const File = use("App/Models/File")

/**
 * General
 * 
*/
const AmazonS3 = use("App/Infrastructure/AmazonS3");

/**
 * Creates a new message to a room
 *
 * @param {string} username
*/
module.exports.create = async (fileStream, type, name, extension, duration) => {

    const externalUrl = process.env.EXTERNAL_URL;
    if (!externalUrl) {
        console.log('External url environment variable not present, file uploads may not work');
    }

    const createdFile = await File.create({
        type,
        name,
        extension,
        key: `${Date.now()}.${extension}`,
        duration_seconds: duration ? Number.parseInt(duration) : null
    });

    await AmazonS3.uploadFile(fileStream, createdFile.key);

    const url = `${externalUrl}/file/content/${createdFile.id}`;

    createdFile.merge({
        url
    });

    await createdFile.save();

    return await module.exports.getById(createdFile.id);
}


/**
 * Get file by id
 *
 * @param {string} fileId
*/
module.exports.getById = async (fileId) => {

    const fileModel = await File.query().where('id', fileId).first();

    return new DTOFile(fileModel.toJSON());
}

/**
 * Get file stream
 *
 * @param {string} fileId
*/
module.exports.getFileStream = async (fileId) => {

    const fileModel = await File.findBy('id', fileId);

    return {
        fileStream: await AmazonS3.downloadFile(fileModel.key),
        name: `${fileModel.name}.${fileModel.extension}`
    };
}