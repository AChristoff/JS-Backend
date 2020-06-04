const router = require('express').Router();
const postController = require('../controllers/postController');
const restrictedPages = require('../middleware/is-auth');
const {sanitizeTitle, sanitizeContent} = require('../middleware/sanitazie');


router.post('/create', restrictedPages.isAuth(),
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    postController.createPost);

router.put('/edit/:postId', restrictedPages.isAuth(),
    [
        sanitizeTitle('title'),
        sanitizeContent('content'),
    ],
    postController.editPost);

router.get('/:postId', postController.getPostById);

router.get('/all', postController.getPosts);

router.delete('/delete/:postId', restrictedPages.isAuth(), postController.deletePost);

module.exports = router;