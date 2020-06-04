const User = require('../models/User');
const {body} = require('express-validator');
const passwordRegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{6,40}$/;

const sanitizeEmail = (fieldName, isRequired) => {

    return body(fieldName)
        .if((value, {req}) => isRequired === 'required' ? true : value !== '')
        .isEmail().withMessage('Please enter a valid email!')
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                })
        })
};

const sanitizePassword = (fieldName, isRequired) => {

    return body(fieldName)
        .if((value, {req}) => isRequired === 'required' ? true : value !== '')
        .trim()
        .matches(passwordRegExp, 'i')
        .withMessage('Password must be between 6-40 chars and contain at least one: uppercase / lowercase / special char / digit');
};

const sanitizeName = (fieldName, isRequired) => {

    return body(fieldName)
        .if((value, {req}) => isRequired === 'required' ? true : value !== '')
        .trim()
        .not()
        .isEmpty().withMessage('Please enter a valid name!')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic!')
        .escape()

};

const sanitizeTitle = (fieldName) => {
    return body(fieldName)
        .trim()
        .not()
        .isEmpty().withMessage('Title is required')
        .escape()
};

const sanitizeContent = (fieldName) => {
    return body(fieldName)
        .trim()
        .not()
        .isEmpty().withMessage('Content is required')
        .escape()
};

module.exports = {
    sanitizeEmail,
    sanitizePassword,
    sanitizeName,
    sanitizeTitle,
    sanitizeContent
};