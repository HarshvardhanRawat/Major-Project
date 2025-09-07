const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/aircnc';

const main = async () => {
        await mongoose.connect(MONGO_URL);
    };

    main()
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('Error connecting to MongoDB', err);
        })

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}

initDB();