//node_modules imports
const express = require('express');
//Router define
const router = express.Router();


//Creating new teams.
router.post('/new',require('./teams/new'));
router.use('/find',require('./teams/find'));

module.exports = router;