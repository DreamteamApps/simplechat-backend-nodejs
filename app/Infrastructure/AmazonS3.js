const AWS = use('aws-sdk');

let s3;
const bucketName = 'dev-quiz';

const initS3 = () => {
    if (s3) return;

    const accessKey = process.env.AMAZON_ACCESS_KEY;
    const secretKey = process.env.AMAZON_SECRET_KEY;

    s3 = new AWS.S3({
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    });
}

/**
 * Get user public github information
 *
 * @param {string} username
*/
module.exports.uploadFile = async (fileStream, fileName) => {

    initS3();

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileStream
        };

        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data.Location)
        });
    });
}

/**
 * Get user public github information
 *
 * @param {string} username
*/
module.exports.downloadFile = async (key) => {

    initS3();

    return new Promise((resolve, reject) => {
        try {
            const params = {
                Bucket: bucketName,
                Key: key,
            };

            const fileStream = s3.getObject(params).createReadStream();
            
            resolve(fileStream);
        } catch (error) {
            reject(error);
        }
    });
}