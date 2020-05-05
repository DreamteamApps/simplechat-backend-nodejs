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
 * Creates a new message to a room
 *
 * @param {string} username
*/
module.exports.create = async (type, name, extension, path, duration) => {


    const externalUrl = process.env.EXTERNAL_URL;
    if (!externalUrl) {
        console.log('External url environment variable not present, file uploads may not work');
    }

    const createdFile = await File.create({
        type,
        name,
        extension,
        path,
        duration_seconds: duration ? Number.parseInt(duration) : null
    });

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
module.exports.getFileToDownloadById = async (fileId) => {

    const fileModel = await File.findBy('id', fileId);

    return {
        path: fileModel.path,
        name: `${fileModel.name}.${fileModel.extension}`
    }
}