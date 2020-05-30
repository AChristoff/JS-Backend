const restrictedPages = require('./auth');
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const carController = require('../controllers/car');

module.exports = app => {
    app.get('/', homeController.index);
    app.get('/user/register', restrictedPages.isAnonymous, userController.registerGet);
    app.post('/user/register', restrictedPages.isAnonymous, userController.registerPost);
    app.get('/user/login', restrictedPages.isAnonymous, userController.loginGet);
    app.post('/user/login', restrictedPages.isAnonymous, userController.loginPost);
    app.post('/user/logout', userController.logout);
    app.get('/user/rents', restrictedPages.isAuthed, userController.myRent);

    app.get('/user/edit', restrictedPages.isAuthed, userController.editUserGet);
    app.post('/user/edit', restrictedPages.isAuthed, userController.editUserPost);

    app.get('/car/add', restrictedPages.hasRole('Admin'), carController.addGet);
    app.post('/car/add', restrictedPages.hasRole('Admin'), carController.addPost);

    app.get('/car/all', carController.getAllCars);

    app.get('/car/search', carController.getSearchCar);

    app.get('/car/rent/:id', restrictedPages.isAuthed, carController.rentGet);
    app.post('/car/rent/:id', restrictedPages.isAuthed, carController.rentPost);

    app.get('/car/cancel-rent/:rentId/car/:carId', restrictedPages.isAuthed, carController.cancelRentGet);

    app.get('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editGet);
    app.post('/car/edit/:id', restrictedPages.hasRole('Admin'), carController.editPost);

    app.get('/car/delete/:id', restrictedPages.hasRole('Admin'), carController.deleteGet);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};