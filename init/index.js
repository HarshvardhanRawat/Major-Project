require('dotenv').config();
const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
};

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}

main()
    .then(async () => {
        await initDB();
        console.log("Data initialization complete");
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        mongoose.connection.close();
    });