const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');

const {jwtSecret} = require('../config/environment');

function validateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            message: 'User data error!',
            errors: errors.array()
        });
        return false;
    }
    return true;
}

module.exports = {
    register: (req, res, next) => {
        if (validateUser(req, res)) {
            const {email, password, name} = req.body;
            const salt = encryption.generateSalt();
            const hashedPassword = encryption.generateHashedPassword(salt, password);
            User.create({
                role: 'User',
                email,
                hashedPassword,
                name,
                salt,
                posts: []
            }).then((user) => {
                res.status(201)
                    .json({message: 'User created!', userId: user._id});
            })
                .catch((error) => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                });
        }
    },
    login: (req, res, next) => {
        if (validateUser(req, res)) {
            const {email, password} = req.body;

            User.findOne({email: email})
                .then((user) => {
                    if (!user) {
                        const error = new Error('User not found!');
                        error.statusCode = 401;
                        error.param = 'email';
                        throw error;
                    }

                    if (!user.authenticate(password)) {
                        const error = new Error('Invalid password!');
                        error.statusCode = 401;
                        error.param = 'password';
                        throw error;
                    }

                    const token = jwt.sign(
                        {
                            role: user.role,
                            name: user.name,
                            email,
                            userId: user._id.toString()
                        },
                        jwtSecret,
                        {expiresIn: '1h'});

                    res.status(200).json(
                        {
                            message: 'User successfully logged in!',
                            token,
                            userId: user._id.toString()
                        });
                })
                .catch(error => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                })
        }
    },
    edit: (req, res, next) => {
        if (validateUser(req, res)) {
            const {email, password, newEmail, newPassword, name} = req.body;

            if (req.userEmail !== email) {
                const error = new Error('Invalid credentials!');
                error.statusCode = 401;
                error.param = 'email';
                throw error;
            }

            if (!user.authenticate(password)) {
                const error = new Error('Invalid credentials!');

                error.statusCode = 401;
                error.param = 'password';
                throw error;
            }


            const salt = user.salt;
            let newUserEmail;
            let newHashedPassword;
            let newName;

            if (newEmail) {
                newUserEmail = newEmail;
            } else {
                newUserEmail = email;
            }

            if (newPassword) {
                newHashedPassword = encryption.generateHashedPassword(salt, newPassword);
            } else {
                newHashedPassword = encryption.generateHashedPassword(salt, password);
            }

            if (name) {
                newName = name;
            } else {
                newName = req.userName;
            }

            if (!newEmail && !newPassword && !name) {
                const error = new Error('New feed is required');
                error.statusCode = 400;
                throw error;
            }

            const newUserData = {
                email: newUserEmail,
                hashedPassword: newHashedPassword,
                name: newName,
                salt,
            };

            User.updateOne({email: email}, newUserData)
                .then(() => {

                    res.status(200).json(
                        {
                            message: 'User successfully edited!',
                        });
                })
                .catch(error => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                })
        }
    },
    delete: (req, res, next) => {
        if (validateUser(req, res)) {
            const {email, password} = req.body;

            User.findOne({email: email})
                .then((user) => {
                    if (!user) {
                        const error = new Error('Invalid credentials!');

                        error.statusCode = 401;
                        error.param = 'email';
                        throw error;
                    }

                    if (!user.authenticate(password)) {
                        const error = new Error('Invalid credentials!');

                        error.statusCode = 401;
                        error.param = 'password';
                        throw error;
                    }

                    if (req.userEmail !== email) {
                        const error = new Error('Invalid credentials!');
                        error.statusCode = 401;
                        error.param = 'email';
                        throw error;
                    }

                    return User.deleteOne({email: email});
                })
                .then(() => {

                    res.status(200).json(
                        {
                            message: 'User successfully deleted!',
                        });
                })
                .catch(error => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                })
        }
    }
};