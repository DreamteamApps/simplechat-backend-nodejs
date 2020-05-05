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

        return new Promise(async (resolve) => {
            try {
                request.multipart.file('file', {}, async (file) => {
                    const fileName = file.clientName.split('.')[0];

                    const createdFile = await FileDomain.create(file.stream, type, fileName, file.extname, duration_seconds);

                    resolve(createdFile);
                })

                request.multipart.process();
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * Returns a file download for the given fileId
     *
     * @param {string} request.file
    */
    async getFileStream({ params, response }) {
        response.implicitEnd = false

        const { fileId } = params;

        const fileStream = await FileDomain.getFileStream(fileId);

        fileStream.pipe(response.response);

    }
}

module.exports = FileController
