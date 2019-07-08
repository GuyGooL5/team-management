//node_modules imports
const express = require('express');

//Router define
const router = express.Router();


router.get('/all', require('./find/all'));

router.get('/team/:team_id', require('./find/team'))
module.exports = router;