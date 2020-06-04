const postRoutes = require('../routes/postRouts');
const authRoutes = require('../routes/auth');

module.exports = (app) => {
    app.use('/post', postRoutes);
    app.use('/auth', authRoutes);
};