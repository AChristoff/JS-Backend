const jwt = require('jsonwebtoken');

const {jwtSecret} = require('../config/environment');

module.exports = {
    isAuth: (role) => (req, res, next) => {
        const authHeaders = req.get('Authorization');
        if (!authHeaders) {
            return res.status(401)
                .json({
                    message: 'Unauthorized!',
                    error: 'Authorization header is missing!'
                });
        }

        const token = req.get('Authorization').split(' ')[1];
        let decodedToken;

        try {
            decodedToken = jwt.verify(token, jwtSecret);
        } catch (error) {
            return res.status(401)
                .json({message: 'Invalid token!', error});
        }

        if (!decodedToken) {
            return res.status(401)
                .json({message: 'Token verification error!'});
        }

        if (role
            && decodedToken.role !== role
            && decodedToken.role !== 'Admin') {

            return res.status(401)
                .json({
                    message: 'Unauthorized!',
                    error: `${role} rights are required!`
                });

        }

        req.userId = decodedToken.userId;
        next();
    }
};