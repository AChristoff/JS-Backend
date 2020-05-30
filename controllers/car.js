const Car = require('../models/Car');
const Rent = require('../models/Rent');

let years = [];
let currentYear = new Date().getFullYear(),
    yearStart = currentYear - 20;

for (let i = yearStart; i <= currentYear; i++) {
    years.push(i)
}

let yearsDesc = [...years];
yearsDesc.sort(function(a, b){return b-a});

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
                res.redirect('/car/all');
            })
            .catch(console.error);

    },
    getAllCars: (req, res) => {

        Car.find({isRented: false})
            .then((cars) => {
                res.render('car/all', {cars, years, yearsDesc});
            })
            .catch(console.error);
    },
    getSearchCar: (req, res) => {
        let model = req.query.model;
        let yearFrom = req.query.yearFrom;
        let yearTo = req.query.yearTo;

        Car.find({isRented: false})
            .where('year')
            .gte(yearFrom)
            .lte(yearTo)
            .then((cars) => {

                if (model.length >= 0) {
                    const filtered = cars.filter(x => x.model.toLowerCase().includes(model.toLowerCase()));
                    cars = {};
                    cars.cars = filtered;
                }

                if (cars.cars.length === 0) {
                    cars.error = 'No results!';
                }

                cars.model = model;
                cars.years = years;
                cars.yearsDesc = yearsDesc;
                cars.yearFrom = yearFrom;
                cars.yearTo = yearTo;
                res.render('car/all', cars);
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
        // TODO validate if needed and sanitize
        const data = {model, imageUrl, pricePerDay};

        Car.findByIdAndUpdate(carId, data)
            .then(() => {
                res.redirect('/car/all')
            })
            .catch(console.error);
    },
    deleteGet: (req, res) => {
        const carId = req.params.id;

        Car.findByIdAndDelete(carId)
            .then(() => {
                res.redirect('/car/all')
            })
            .catch(console.error);
    },
};