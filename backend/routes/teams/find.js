//node_modules imports
const express = require('express');

const User = require('../../models/user');
const Team = require('../../models/team');
//Router define
const router = express.Router();


router.get('/',(req,res)=>{res.send('im working')})

router.get('/userid',require('./find/userid'));

module.exports = router;