const Team = require('../../models/team');

module.exports = (req, res) => {
    if (req.user._id) {
        let { team_id, member_id } = req.body;
        if (!team_id) res.status(400).send({ error: "Please select team" });
        if (!member_id) res.status(400).send({ error: "Please select member" })
        if (team_id && member_id) Team.removeMemberFromTeam(team_id, req.user._id, member_id).then(success => {
            res.send(success);
        }).catch(err => res.status(400).send(err));
    }
}