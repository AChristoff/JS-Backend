const feedRoutes = require('../routes/feed');
const authRoutes = require('../routes/auth');

module.exports = (app) => {
    app.use('/feed', feedRoutes);
    app.use('/auth', authRoutes);
};