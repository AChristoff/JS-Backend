const restrictedPages = require('./auth');
const homeController = require('../controllers/home');

module.exports = app => {
    app.get('/', homeController.index);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};