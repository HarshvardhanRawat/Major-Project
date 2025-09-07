const expres = require('express');
const app = expres();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const ejs = require('ejs');

const port = 8080;

const MONGO_URL = 'mongodb://127.0.0.1:27017/aircnc';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('HI, I am root');
});

// Index route to show all listings

app.get ('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs' , {allListings});
});

//New route to show form to create new listing
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

// Show route to show details of a specific listing
app.get('/listings/:id', async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
});

//Create route to add new listing to the database
app.get('/listings', async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// app.get("/testListing" , async (req, res) => {
//     let sampleListing = new Listing({
//         title: 'my new villa',
//         description: 'by the beach',
//         price: 1200,
//         location: 'Goa',
//         country: 'India',
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send('successful testing');
// });

app.listen (port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});