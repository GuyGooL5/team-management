const Team = require('../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.user._id) {
        Team.deleteTeam(req.params.id,req.user._id).then(success=>{
            res.send(success);
        }).catch(err=>res.status(400).send(err));
    }else res.status(401).send({error:"Unauthorized."})
}