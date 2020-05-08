
/**
 * General
 * 
*/
const toArray = use('stream-to-array')

module.exports.toBuffer = async (fileStream) => {
    return toArray(fileStream).then(function (parts) {
        let buffers = [];

        for (let i = 0, l = parts.length; i < l; ++i) {
            let part = parts[i]
            buffers.push((part instanceof Buffer) ? part : new Buffer(part));
        }

        return Buffer.concat(buffers);
    });
}