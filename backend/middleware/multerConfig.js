const multer = require("multer")

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, clb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid mime type")

        if(isValid)
            error = null

        clb(error, "backend/images")
    },
    filename: (req, file, clb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-')
        const ext = MIME_TYPE_MAP[file.mimetype]
        clb(null, name + '-' + Date.now() + '.' + ext)
    }
})

module.exports = multer({storage: storage}).single('image')