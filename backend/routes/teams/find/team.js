const User = require('../../../models/user');
const Team = require('../../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.params.team_id) {
        Team.getTeamDetails(req.params.team_id).then(team => {
            res.send(team);
        }).catch(err=>res.status(400).send(err));
    }else res.status(400).send({error:"Please specify team id"});
}