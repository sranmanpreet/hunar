const mongoose = require('mongoose');

const ArtSize = mongoose.model('ArtSize');

module.exports.getArtSizes = (req, res, next) => {
    ArtSize.find((err, artSizes) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message + " ErrorCode-11102"
            });
        } else {
            return res.status(200).json(artSizes);
        }
    });
}

module.exports.createArtSize = (req, res, next) => {
    let newArtSize = new ArtSize({
        value: req.body.artSize
    });

    newArtSize.save((err, artSize) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        } else {
            return res.status(200).json({
                message: "ArtSize saved"
            });
        }
    });
}

module.exports.deleteArtSize = (req, res, next) => {
    ArtSize.deleteOne({ value: req.params.artsize }, (err, success) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        } else {
            return res.status(200).json({
                message: "ArtSize deleted"
            });
        }
    })
}