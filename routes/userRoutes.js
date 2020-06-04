const router = require('express').Router();
const userController = require('../controllers/userController');
const {body} = require('express-validator');
const restrictedPages = require('../middleware/authenticate');
const {sanitizeEmail, sanitizePassword, sanitizeName} = require('../middleware/sanitazie');



router.post('/register',
    [
        sanitizeEmail('email', 'required'),
        sanitizePassword('password', 'required'),
        sanitizeName('name', 'required')
    ],
    userController.register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email!'),
        sanitizePassword('password', 'required')
    ],
    userController.login);
router.put('/edit', restrictedPages.isAuth(),
    [
        body('email').isEmail().withMessage('Please enter a valid email!'),
        sanitizePassword('password', 'required'),
        sanitizeEmail('newEmail'),
        sanitizePassword('newPassword'),
        sanitizeName('name')
    ],
    userController.edit);
router.delete('/delete', restrictedPages.isAuth(), userController.delete);

module.exports = router;
