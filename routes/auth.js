const router = require('express').Router();
const {body} = require('express-validator/check');
const authController = require('../controllers/auth');
const User = require('../models/User');
const regExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]{6,60}$/;

router.post('/register',
    [
        body('email')
            .isEmail().withMessage('Please enter a valid email!')
            .custom((value, {req}) => {
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail address already exists!');
                        }
                    })
            }),
        body('password')
            .trim()
            .matches(regExp, 'i')
            .withMessage('Password must be min 6 char long and contain at least one uppercase, lower case, special char and one digit!'),
        body('name')
            .trim()
            .not()
            .isEmpty().withMessage('Please enter a valid name!')
            .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic!')
            .escape()
    ],
    authController.register
);

router.post('/login', authController.login);
router.post('/edit',
    [
        body('email')
            .isEmail().withMessage('Please enter a valid email!'),
        body('password')
            .trim()
            .matches(regExp, 'i')
            .withMessage('Password must be min 6 char long and contain at least one uppercase, lower case, special char and one digit!'),
        body('newEmail')
            .if((value, {req}) => value !== '')
            .isEmail().withMessage('Please enter a valid email!')
            .custom((value, {req}) => {
                return User.findOne({email: value})
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail address already exists!');
                        }
                    })
            }),
        body('newPassword')
            .if((value, {req}) => value !== '')
            .trim()
            .matches(regExp, 'i')
            .withMessage('Password must be min 6 char long and contain at least one uppercase, lower case, special char and one digit!'),
        body('name')
            .if((value, {req}) => value !== '')
            .trim()
            .not()
            .isEmpty().withMessage('Please enter a valid name!')
            .matches(/^[A-Za-z\s]+$/).withMessage('Name must be alphabetic!')
            .escape(),
    ],
    authController.edit);
router.post('/delete', authController.delete);

module.exports = router;
