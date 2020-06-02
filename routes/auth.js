const router = require('express').Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');
const {sanitizeEmail, sanitizePassword, sanitizeName} = require('../middleware/sanitazie');

router.post('/register',
    [
        sanitizeEmail('email', 'required'),
        sanitizePassword('password', 'required'),
        sanitizeName('name', 'required')
    ],
    authController.register
);

router.post('/login', authController.login);
router.post('/edit', isAuth,
    [
        body('email').isEmail().withMessage('Please enter a valid email!'),
        sanitizePassword('password', 'required'),
        sanitizeEmail('newEmail'),
        sanitizePassword('newPassword'),
        sanitizeName('name')
    ],
    authController.edit);
router.post('/delete', isAuth, authController.delete);

module.exports = router;
