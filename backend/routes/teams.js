//node_modules imports
const express = require('express');
const passport = require('passport');


//Router define
const router = express.Router();

//Creating new teams.
router.post('/new',passport.authenticate('jwt',{session:false}),require('./teams/new'));
router.post('/addmember',passport.authenticate('jwt',{session:false}),require('./teams/newMember'));
router.post('/permit',passport.authenticate('jwt',{session:false}),require('./teams/permitMember'));
router.post('/removemember',passport.authenticate('jwt',{session:false}),require('./teams/removeMember'));
router.delete('/delete/:id',passport.authenticate('jwt',{session:false}),require('./teams/delete'));
router.use('/find',require('./teams/find'));



//delete later
const User=require('../models/user');
router.get('/exitallteams/:id',(req,res)=>{
    User.findByIdAndUpdate(req.params.id,{teams:[]},(err,user)=>{
        res.send('good');
    });
})




module.exports = router;