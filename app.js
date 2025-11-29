const expres = require('express');
const app = expres();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const ejs = require('ejs');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema} = require('./schema.js');

//Needed to read form data
app.use(expres.urlencoded({ extended: true }));

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.use(expres.static(path.join(__dirname, 'public')));
app.use('/logo', expres.static(path.join(__dirname, 'logo')));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, result.error)
    } else {
        next();
    }
};

app.get('/', wrapAsync(async (req, res) => {
    const heroListings = await Listing.find({}).limit(5);
    res.render("listings/main.ejs", {heroListings});
}));

// Index route to show all listings
app.get ('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs' , {allListings});
}));

//New route to show form to create new listing
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

// Show route to show details of a specific listing
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
}));

//Create route to add new listing to the database
app.post('/listings', validateListing, wrapAsync(async (req, res) => {
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
}));

//Edit route to update a specific listing
app.get('/listings/:id/edit', validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', {listing});
}));

//Update route to update a specific listing in the database
app.put('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${listing._id}`);
}));

//Delete route to delete a specific listing from the database
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

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

app.use((err, req, res, next) => {
    let {satusCode=500, message="Something Went Wrong!"} = err;
    res.status(statusCode).render('error.ejs', {err});
    //res.status(statusCode).send(message);
});

app.listen (port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});