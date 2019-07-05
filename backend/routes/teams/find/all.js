const User = require('../../../models/user');
const Team = require('../../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if(req.user._id){
        User.getTeamsByUserId(req.user._id,(err,user)=>{
            if(err) res.status(400).send(err);
            if(user) res.send(user);
        });
    }
    else res.status(401).send({error:'Unautharized'});
}