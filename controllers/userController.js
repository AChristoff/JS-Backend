const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const encryption = require('../util/encryption');
const {jwtSecret} = require('../config/environment');

module.exports = {
    register: (req, res, next) => {
        if (validator(req, res)) {
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
        if (validator(req, res)) {
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
        if (validator(req, res)) {
            const {email, password, newEmail, newPassword, name} = req.body;

            User.findOne({email: email})
                .then((user) => {
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

                    if (newEmail) {
                        user.email = newEmail;
                    }

                    if (newPassword) {
                        user.hashedPassword = encryption.generateHashedPassword(user.salt, newPassword);
                    }

                    if (name) {
                        user.name = name;
                    }

                    if (!newEmail && !newPassword && !name) {
                        const error = new Error('New feed is required');
                        error.statusCode = 400;
                        throw error;
                    }

                    user.save()
                        .then(() => {
                            res.status(200).json({
                                message: 'User updated successfully!',
                                user: {email: user.email, name: user.name},
                            })
                        })
                        .catch((error) => {
                            if (!error.statusCode) {
                                error.statusCode = 500;
                            }

                            next(error);
                        });


                })
                .catch(error => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }

                    next(error);
                });
        }
    },
    delete: (req, res, next) => {
        if (validator(req, res)) {
            const {email, password} = req.body;

            if (req.userEmail !== email) {
                const error = new Error('Invalid credentials!');
                error.statusCode = 401;
                error.param = 'email';
                throw error;
            }

            if (req.userRole === 'Admin') {
                const error = new Error('Admin can not be deleted!');
                error.statusCode = 403;
                throw error;
            }

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

function validator(req, res) {
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