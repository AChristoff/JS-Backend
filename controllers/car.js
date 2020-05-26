const Car = require('../models/Car');

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: (req, res) => {
        // 1. Get info from req.body
        // 2. Validate entity and/or parse data
        // 3. Insert into DB

        const carBody = req.body; //1.
        carBody.pricePerDay = Number(carBody.pricePerDay); //2. parse
        //2. TODO: validate
        Car.create(carBody)
            .then(() => {
                res.redirect('/');
            })
            .catch(console.error);

    },
    getAllCars: (req, res) => {
        Car.find()
            .then((cars) => {
                res.render('car/all', {cars});
            })
            .catch(console.error);
    },
    rent: (req, res) => {
    },
    editGet: (req, res) => {
    },
    editPost: (req, res) => {
    },
};