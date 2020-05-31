const router = require('express').Router();
const {body} = require('express-validator/check');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts);
router.post('/post/create', isAuth, [
    body('title')
        .trim()
        .not()
        .isEmpty().withMessage('Title is required')
        .escape(),
    body('content')
        .trim()
        .not()
        .isEmpty().withMessage('Content is required')
        .escape(),
], feedController.createPost);
router.delete('/post/delete/:postId', isAuth, feedController.deletePost);
router.get('/post/:postId', isAuth, feedController.getPostById);
router.put('/post/update/:postId', isAuth, feedController.updatePost);

module.exports = router;