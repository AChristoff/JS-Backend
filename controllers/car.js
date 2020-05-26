const Car = require('../models/Car');
const Rent = require('../models/Rent');

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
        Car.find({isRented: false})
            .then((cars) => {
                res.render('car/all', {cars});
            })
            .catch(console.error);
    },
    rentGet: (req, res) => {
        const carId = req.params.id;

        Car.findById(carId)
            .then((car) => {
                res.render('car/rent', car);
            })
            .catch(console.error);


    },
    rentPost: (req, res) => {
        const car = req.params.id;
        const user = req.user._id;
        const days = Number(req.body.days);

        Rent.create({car, user, days})
            .then(() => {
                Car.findById(car)
                    .then((c) => {
                        c.isRented = true;

                        return c.save();
                    })
                    .then(() => {
                        res.render('car/all');
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    },
    editGet: (req, res) => {
    },
    editPost: (req, res) => {
    },
};