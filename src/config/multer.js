const multer = require("multer");

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads");

    },

    filename: function(req, file, cb){

        const nombre =
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-");

        cb(null, nombre);

    }

});

const upload = multer({
    storage
});

module.exports = upload;