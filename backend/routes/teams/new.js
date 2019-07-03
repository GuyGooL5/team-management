const User = require('../../models/user');
const Team = require('../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.user._id) {
        let bodyObj = {}
        if (req.body.description) bodyObj.description = req.body.description;
        if (req.body.name) bodyObj.name = req.body.name;
        else res.status(400).send({
            error: 'Invalid name'
        });
        bodyObj.owner = req.user._id;
        bodyObj.members = [{
            user: req.user._id,
            since: new Date(),
            permission: 'owner'
        }];

        let newTeam = new Team(bodyObj);

        Team.createTeam(newTeam, (err, team) => {
            if (team) {
                User.addTeam(team.owner, team._id, (err, user) => {
                    if (user) {
                        res.send({
                            success: true,
                            team: team
                        })
                    } else res.status(500).send({
                        error: 'Server Internal Error'
                    });
                })
            } else res.status(400).send({
                success: false,
                msg: 'Failed to create team'
            });
        });
    } else res.status(401).send({
        error: "Unauthorized."
    })
}