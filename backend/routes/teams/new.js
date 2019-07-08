const User = require('../../models/user');
const Team = require('../../models/team');


//Creating new teams
module.exports = (req, res) => {
    if (req.user._id) {
        let { name, description } = req.body;
        if (!name) res.status(400).send({ error: "No team nam was given." });
        else {
            let bodyObject={
                name:name,
                description:description,
                owner:req.user._id
            }
            let newTeam = Team.newTeamModel(bodyObject);
            Team.createTeam(newTeam).then(team => {
                res.send(team);
            }).catch(err=>res.status(400).send(res));
        }
    } else res.status(401).send({ error: "Unauthorized." })
}