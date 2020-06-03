const router = require('express').Router();
const {body} = require('express-validator/check');
const feedController = require('../controllers/feed');
const restrictedPages = require('../middleware/is-auth');
const {sanitizeTitle, sanitizeContent} = require('../middleware/sanitazie');


router.post('/post/create', restrictedPages.isAuth(),
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    feedController.createPost);
router.get('/post/:postId', feedController.getPostById);
router.put('/post/update/:postId', restrictedPages.isAuth(),
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    feedController.updatePost);
router.get('/posts', feedController.getPosts);
router.delete('/post/delete/:postId', restrictedPages.isAuth(), feedController.deletePost);

module.exports = router;