//node_modules imports
const express = require('express');
const passport = require('passport');
//Router define
const router = express.Router();

router.post('/register',require('./users/register'));

router.post('/auth',require('./users/auth'));

router.post('/validate',require('./users/validate'));
router.get('/find/:text',require('./users/find'));


//protected routes
router.get('/logout',passport.authenticate('jwt',{session:false}),require('./users/logout'));
router.get('/profile',passport.authenticate('jwt',{session:false}),require('./users/profile'));


module.exports = router;