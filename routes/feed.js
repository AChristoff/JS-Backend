const router = require('express').Router();
const {body} = require('express-validator/check');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts);
router.post('/post/create', isAuth, [
    body('title')
        .not()
        .isEmpty().withMessage('Title is required')
        .trim()
        .escape(),
    body('content')
        .not()
        .isEmpty().withMessage('Content is required')
        .trim()
        .escape(),
], feedController.createPost);
router.delete('/post/delete/:postId', isAuth, feedController.deletePost);
router.get('/post/:postId', isAuth, feedController.getPostById);
router.put('/post/update/:postId', isAuth, feedController.updatePost);

module.exports = router;