const jwtHelper = require('./jwtHelper');

module.exports.authorize = (roles = [], req, res, next) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        (req, res, next) => {
            jwtHelper.verifyJwtToken(req, res);
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(403).json({ message: 'Unauthorized' });
            }

            next();
        }
    ];
}