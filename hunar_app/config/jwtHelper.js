const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res) => {
    var token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (!token) {
        return res.status(400).send({
            auth: false,
            message: 'Access token not provided'
        });
    } else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        auth: false,
                        message: 'Authentication failed.'
                    });
                } else {
                    req.session.userId = decoded._id;
                    req.user = decoded;
                }
            });
    }
}