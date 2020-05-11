let Duplex = require('stream').Duplex;

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
const AmazonS3 = use("App/Infrastructure/AmazonS3")
const UUID = use("uuid")
const MessageTypes = use("App/Enum/MessageTypes")
const Stream = use("App/Helpers/Stream")
const Jimp = use('jimp')


/**
 * Creates a new message to a room
 *
 * @param {string} username
*/
module.exports.create = async (fileStream, type, name, extension, duration_seconds) => {

    const externalUrl = process.env.EXTERNAL_URL;
    if (!externalUrl) {
        console.log('External url environment variable not present, file uploads may not work');
    }

    const fileBuffer = await Stream.toBuffer(fileStream);

    const file = await File.create({
        type,
        name,
        extension,
        key: UUID.v4(),
        duration_seconds: duration_seconds ? Number.parseInt(duration_seconds) : null
    });

    const fileUploadPromise = AmazonS3.uploadFile(fileBuffer, file.key).then(() => {
        file.merge({
            url: `${externalUrl}/file/content/${file.key}`
        });
    });

    const uploadPromises = [fileUploadPromise];

    if (type == MessageTypes.IMAGE) {
        const thumbnail = await File.create({
            type,
            name: `${name}-thumbnail`,
            extension,
            key: UUID.v4()
        });

        const thumbnailBuffer = await Jimp.read(fileBuffer).then(imageFile => {
            return imageFile.cover(200, 200).quality(60).getBufferAsync(imageFile._originalMime);
        });

        const thumbnailUploadPromise = AmazonS3.uploadFile(thumbnailBuffer, thumbnail.key).then(async () => {
            thumbnail.merge({
                url: `${externalUrl}/file/content/${file.key}`
            });

            await thumbnail.save();

            file.merge({
                thumbnail_url: `${externalUrl}/file/content/${thumbnail.key}`
            });
        });;

        uploadPromises.push(thumbnailUploadPromise);
    }

    await Promise.all(uploadPromises);

    await file.save();

    return await module.exports.getById(file.id);
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
 * @param {string} fileKey
*/
module.exports.getFileStream = async (fileKey) => {

    const fileModel = await File.findBy('key', fileKey);

    return {
        fileStream: await AmazonS3.downloadFile(fileModel.key),
        name: `${fileModel.name}.${fileModel.extension}`
    };
}