const mongoose = require('mongoose');

const ArtType = mongoose.model('ArtType');

module.exports.getArtTypes = (req, res, next) => {
    ArtType.find((err, artTypes) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message + " ErrorCode-10102"
            });
        } else {
            return res.status(200).json(artTypes);
        }
    });
}

module.exports.createArtType = (req, res, next) => {
    let newArtType = new ArtType({
        value: req.body.value.trim()
    });

    newArtType.save((err, artType) => {
        if (err) {
            if (err.name == "MongoError" && err.code == 11000) {
                return res.status(422).send("Art Type already exist");
            } else {
                return res.status(500).json({
                    error: err.message
                });
            }
        } else {
            return res.status(200).send(artType);
        }
    });
}

module.exports.deleteArtType = (req, res, next) => {
    ArtType.deleteOne({ _id: req.params.id }, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        } else {
            return res.status(200).json({
                message: "ArtType deleted"
            });
        }
    })
}