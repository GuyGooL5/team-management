const { Schema, model } = require('mongoose');

const TeamSchema = Schema({
    name: {
        type: Schema.Types.String,
        require: true
    },
    description: Schema.Types.String,
    owner: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        since: Schema.Types.Date,
        permission: Schema.Types.String
    }]
});




//handle team removal
TeamSchema.pre('remove', function (next) {
    var team = this;
    team.model('User').updateMany({ teams: team._id }, { $pull: { teams: team._id } }, (err, res) => {
        if (err) next(err);
        if (!res) next({ error: "Cant remove team reference from user" });
        else next();
    })
})
TeamSchema.pre('save', function (next) {
    var team = this;
    if (team.isNew) {
        if (!team.owner) next({ error: "No team owner" });
        else team.model('User').findById(team.owner, '_id teams', (err, user) => {
            if (err) next(err);
            if (!user) next({ error: "Wrong owner id" });
            else {
                team.members.push({ user: user._id, since: new Date(), permission: "owner" });
                user.teams.push(team._id);
                user.save(next);
            }
        })
    }
    else next();
})
const TeamModel = model('Team', TeamSchema);

module.exports = TeamModel;