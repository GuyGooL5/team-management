const {
    Schema,
    model
} = require('mongoose');
const bcrypt = require('bcryptjs');

const Team = require('./team');
//User Schema
const UserSchema = Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
    }]
});

const User = model('User', UserSchema);

User.getUserByUsername = (username, callback) => {
    const query = {
        username: username
    };
    User.findOne(query, callback);
}
User.getUserByEmail = (email, callback) => {
    const query = {
        email: email
    }
    User.findOne(query, callback);
}
User.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save((err, user) => {
                callback(err, user);
            });
        });
    });
}
User.addTeam = (userId, teamId, callback) => {
    query = {
        $push: {
            teams: teamId
        }
    };
    User.findByIdAndUpdate(userId, {
        $push: {
            teams: teamId
        }
    }, callback);
}
User.getTeamsByUserId = (userId, callback) => {
    User.findById(userId, 'teams').populate({
        path: 'teams',
        populate: {
            path: 'members.user',
            model:'User',
            select: 'firstname lastname username email'
        }
    }).exec(callback);
}

User.comparePassword = (candid, hash, callback) => {
    bcrypt.compare(candid, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}

module.exports = User;