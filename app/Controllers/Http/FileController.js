'use strict'
const Helpers = use('Helpers')

/**
 * Domains
 * 
*/
const FileDomain = use('App/Domain/FileDomain')

class FileController {

    /**
     * Upload a file and return its db register
     *
     * @param {string} request.file
    */
    async upload({ request }) {
        const { type, duration_seconds } = request.all();

        const basePath = `${Helpers.tmpPath('uploads')}\\${type}`;

        const file = request.file('file', {
            size: '5mb',
            extnames: ['jpg', 'jpeg', 'png', 'mp3', 'wav']
        });

        const newFilename = `${Date.now()}.${file.extname}`;
        await file.move(basePath, {
            name: newFilename,
            overwrite: true
        });

        return await FileDomain.create(type, file.clientName.split('.')[0], file.extname, `${basePath}\\${newFilename}`, duration_seconds);
    }

    /**
     * Returns a file download for the given fileId
     *
     * @param {string} request.file
    */
   async getFileStream({ params, response }) {
    const {fileId} = params;
    const file = await FileDomain.getFileToDownloadById(fileId);

    response.attachment(file.path, file.name);
   }
}

module.exports = FileController
