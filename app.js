if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



//Express Set up
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//Ejs-mate Set up
const ejsMate = require('ejs-mate');
//Express Session Set up
const session = require('express-session');
const MongoStore = require('connect-mongo');
//Flash Set Up
const flash = require('connect-flash');
//Error Catcher Class
const ExpressError = require('./utils/expressError');

//Method Override
const methodOverride = require('method-override');
//passport set up
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

//Helmet
const helmet = require('helmet')

//Mongo sanitize
const sanitizeV5 = require('./utils/mongoSanitizeV5.js')



//Router 
const usersRoutes = require('./routes/users')
const waifulocationsRoutes = require('./routes/waifulocations');
const commentsRoutes = require('./routes/comments')

//Mongoose Set up
const database = process.env.DBURL || 'mongodb://localhost:27017/waifuLoc';
mongoose.connect(database);
// 
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Data base connected");
});

const app = express();
app.set('query parser', 'extended');


//Set UP use, Set and Directory, Path
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(sanitizeV5({ replaceWith: '_' }));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisisheryza';

const store = MongoStore.create({
    mongoUrl: database,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("Session store ERROR!", e)
});

const sessionConfig = {
    store,
    name: 'mmkbsh',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "defaultSrc": [],
            "connectSrc": ["'self'", "data: https:"],
            "scriptSrc": ["'unsafe-inline'", "'self'", "data: https:"],
            "styleSrc": ["'self'", "'unsafe-inline'", "data: https:"],
            "workerSrc": ["'self'", "blob:"],
            "objectSrc": [],
            "imgSrc": [
                "'self'",
                "blob:",
                "data: https:",
                "https://res.cloudinary.com/drltvwfnh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            "fontSrc": ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.signedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// Home
app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', usersRoutes);
app.use('/waifulocations', waifulocationsRoutes);
app.use('/waifulocations/:id/comments', commentsRoutes);




//Error Handler
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Not Found", 404))
})

app.use((err, req, res, next) => {
    const { message = "Something Went Wrong!", status = 500 } = err;
    if (!err.message) err.message = "Oh No!, Something Went Wrong!"
    res.status(status).render('error', { err })

})


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})