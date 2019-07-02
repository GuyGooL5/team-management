const {
    Schema,
    model
} = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');

const User = require('./user');
//Team Schema
const MemberSchema = Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    since:Schema.Types.Date,
    permission:String
})
const TeamSchema = Schema({
    name: {
        type: String,
        require: true
    },
    description: String,
    owner: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    members: [MemberSchema]
});

const Team = model('Team', TeamSchema);




//Get a list of all the members of a team.
Team.getTeamMembers = (teamId, callback) => {
    Team.findById(teamId, (err, team) => {
        if (err) {
            throw err;
            callback(err, false);
        } else if (team) {
            console.log(team);
        }
    })
}
Team.createTeam = (newTeam, callback) => {
    newTeam.save((err, team) => {
        callback(err, team);
    });
}


Team.comparePassword = (candid, hash, callback) => {
    bcrypt.compare(candid, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

module.exports = Team;