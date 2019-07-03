const User = require('../../../models/user');
const Team = require('../../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if(req.params.id){
        User.getTeamsByUserId(req.params.id,(err,user)=>{
            if(err) res.status(400).send(err);
            if(user) res.send(user);
        });
    }
    else res.status(400).send({error:'Please enter id'});
}