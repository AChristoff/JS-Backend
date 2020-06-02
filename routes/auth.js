const router = require('express').Router();
const authController = require('../controllers/auth');
const {body} = require('express-validator/check');
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
router.post('/edit',
    [
        body('email').isEmail().withMessage('Please enter a valid email!'),
        sanitizePassword('password', 'required'),
        sanitizeEmail('newEmail'),
        sanitizePassword('newPassword'),
        sanitizeName('name')
    ],
    authController.edit);
router.post('/delete', authController.delete);

module.exports = router;
