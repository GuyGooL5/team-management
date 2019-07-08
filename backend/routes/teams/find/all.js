const User = require('../../../models/user');
const Team = require('../../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if(req.user._id){
        User.getUserTeamsById(req.user._id).then(user=>{
            res.send(user);
        }).catch(err=>res.status(400).send(err));
    }
    else res.status(401).send({error:'Unautharized'});
}