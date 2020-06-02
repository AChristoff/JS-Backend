const User = require('../models/User');
const {body} = require('express-validator/check');
const regExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{6,60}$/;

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
        .matches(regExp, 'i')
        .withMessage('Password must be min 6 char long and contain at least one: uppercase / lowercase / special char / digit');
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

module.exports = {
    sanitizeEmail,
    sanitizePassword,
    sanitizeName
};