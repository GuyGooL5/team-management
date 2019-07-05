const User = require('../../../models/user');
const Team = require('../../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.params.team_id) {
        Team.getTeamDetails(req.params.team_id, (err, team) => {
            if (err) res.status(400).send(err);
            else if (team) res.send({success:true,team:team});
            else res.status(400).send({success:false,msg:"Can't find team."})
        });
    } else res.status(400).send({
        error: 'Please specify team_id'
    });
}