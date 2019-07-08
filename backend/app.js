//node_modules imports
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
//dotenv init
require('dotenv').config();


//Config imports
const config = require('./config/database');

//----------------------------------------------------------

//App setup

//Express setup
const app = express();
//----------------------------------------------------------
//Middlewares

//CORS is used only in development stages,
//When going in production it will become no-cors
app.use(cors());

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
mongoose.connect(config.database_url_prod, {
    useNewUrlParser: true
})
//Events
mongoose.connection.on('connected', () => {
    console.log('Connected to Database:', config.database_url_prod);
})
mongoose.connection.on('error', (err) => {
    console.log('Database Error:', err);
})
//----------------------------------------------------------

//Routes
const users = require('./routes/users');
app.use('/api/users', users);
const teams = require('./routes/teams');
app.use('/api/teams', teams);

app.use('/',express.static('../client/build'));
app.use('/team/*',express.static('../client/build'));

//Manage React stuff
// app.get('*/*', (req, res) => {
//     res.send('404 Page not found').status(404);
// })
//----------------------------------------------------------

//Start the server
const PORT = 3300;
app.listen(PORT, () => {
    console.log('Server started on port:', PORT)
})


module.exports = app;