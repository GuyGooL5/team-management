//node_modules imports
const express = require('express');

const User = require('../../models/user');
const Team = require('../../models/team');
//Router define
const router = express.Router();


router.get('/',(req,res)=>{res.send('im working')})

router.get('/all',require('./find/all'));

router.get('/team/:team_id',require('./find/team'))
module.exports = router;