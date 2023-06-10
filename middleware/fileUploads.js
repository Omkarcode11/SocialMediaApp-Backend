const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage');
const util = require('util');

let storage = new GridFsStorage({
    url: "mongodb://127.0.0.1:27017/Freedom",
    file: (req, file) => {
        const match = ['image/png', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-ok-${file.originalname}`
            return filename
        }
        return {
            bucketName: 'photo',
            filename: `${Date.now()}-ok-${file.originalname}`

        }
    }
})

let uploadFiles = multer({ storage: storage }).single('photo')
let uploadFilesMiddleware = util.promisify(uploadFiles)
module.exports = uploadFilesMiddleware