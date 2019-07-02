//node_modules imports
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const morgan = require('morgan');
const mongoose = require('mongoose');
//dotenv init
require('dotenv').config();


//Config imports
const config = require('./config/database');

//----------------------------------------------------------

//sessions setup
let sess = {
    secret: process.env.SEESION_SECRET,
    cookie: {
        secure: true
    },
    resave: false,
    saveUninitialized: true,
}
//App setup

//Express setup
const app = express();
//----------------------------------------------------------
//Middlewares

//CORS is used only in development stages,
//When going in production it will become no-cors
app.use(cors());

//Morgan logs any request to console
//app.use(morgan('tiny'));
//Body parser to json
//Verifies that all incoming json files are as expceted and if not an error is sent back
app.use(bodyParser.json({verify:(req,res,buf,next)=>{
    try{
        JSON.parse(buf.toString())
    }
    catch(e){
        res.status(400).send({error:"inavild JSON format detected"})
    }
    next;
}}));
//Cookie parser to json
app.use(cookieParser());
//MethodOverride
app.use(methodOverride('_method'));
//Passport
app.use(passport.initialize());
app.use(passport.session());

//User auth0 passport strategy
require('./config/passport')(passport);
//----------------------------------------------------------
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


//MongoDB
//Connection Credentials
mongoose.connect(config.database_url, {
    useNewUrlParser: true
})
//Events
mongoose.connection.on('connected', () => {
    console.log('Connected to Database:', config.database_url);
})
mongoose.connection.on('error', (err) => {
    console.log('Database Error:', err);
})
//----------------------------------------------------------

//Routes
const users = require('./routes/users');
app.use('/users', users);
const teams = require('./routes/teams');
app.use('/teams', teams);


//Manage React stuff
app.get('*/*', (req, res) => {
    res.send('404 Page not found').status(404);
})
//----------------------------------------------------------

//Start the server
const PORT = 3300;
app.listen(PORT, () => {
    console.log('Server started on port:', PORT)
})