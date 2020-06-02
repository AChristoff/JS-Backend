const router = require('express').Router();
const {body} = require('express-validator/check');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');
const {sanitizeTitle, sanitizeContent} = require('../middleware/sanitazie');


router.post('/post/create', isAuth,
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    feedController.createPost);
router.get('/post/:postId', isAuth, feedController.getPostById);
router.put('/post/update/:postId', isAuth,
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    feedController.updatePost);
router.get('/posts', isAuth, feedController.getPosts);
router.delete('/post/delete/:postId', isAuth, feedController.deletePost);

module.exports = router;