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
    rentPost: async (req, res) => {
        const car = req.params.id;
        const user = req.user._id;
        const days = Number(req.body.days);

        try {
            const rent = await Rent.create({car, user, days});
            const carById = await Car.findById(car);
            carById.isRented = true;
            await carById.save();
            req.user.rents.push(rent._id);
            await req.user.save();
            res.render('car/all');
        } catch (e) {
            console.error(e);
        }
    },
    editGet: (req, res) => {
        const carId = req.params.id;
        Car.findById(carId)
            .then((car) => {
                res.render('car/edit', car);
            })
            .catch(console.error);

    },
    editPost: (req, res) => {
        const carId = req.params.id;
        const {model, imageUrl, pricePerDay} = req.body;

        Car.findById(carId)
            .then((car) => {
                car.model = model;
                car.imageUrl = imageUrl;
                car.pricePerDay = pricePerDay;
                console.log();
                return car.save();
            })
            .then(() => { res.redirect('/car/all') })
            .catch(console.error);
    },
};