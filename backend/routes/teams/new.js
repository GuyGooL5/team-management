const User = require('../../models/user');
const Team = require('../../models/team');


//Creating new teams
module.exports = (req, res) => {
    let bodyObj = {}

    if (req.body.description) bodyObj.description = req.body.description;
    if (req.body.name) bodyObj.name = req.body.name;
    else res.status(400).send({
        error: 'Invalid name'
    });
    if (req.body.ownerId) {
        bodyObj.owner = req.body.ownerId;
        bodyObj.members = [{
            user:req.body.ownerId,
            since:new Date(),
            permission: 'manager'
        }];
    } else res.status(400).send({
        error: "Inavild owner ID"
    });
    
    let newTeam = new Team(bodyObj);

    Team.createTeam(newTeam, (err, team) => {
        if (team) {
            User.addTeam(team.owner,team._id, (err, user) => {
                if(user){
                    console.log(user);
                    res.send({success:true,team:team})
                }
                else res.status(500).send({error:'Server Internal Error'});
            })
        } else res.status(400).send({
            success: false,
            msg: 'Failed to create team'
        });
    });
}