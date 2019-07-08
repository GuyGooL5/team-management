const Team = require('../../models/team');

module.exports = (req, res) => {
    if (req.user._id) {
        let { team_id, member_id } = req.body;
        if (!team_id) res.status(400).send({ error: "Please select team" });
        if (!member_id) res.status(400).send({ error: "Please select member" })
        if (team_id && member_id) Team.addMemberToTeam(team_id, req.user._id, member_id).then(success=> {
            res.send(success);
        }).catch(err=>res.send(err));
        else res.status(400).send({ error: "Bad request" });
    } else res.status(401).send({ error: "Unautherized Action" })
}