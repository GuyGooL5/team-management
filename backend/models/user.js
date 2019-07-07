const {
    Schema,
    model,
    Types
} = require('mongoose');
const bcrypt = require('bcryptjs');

//User Schema
const UserSchema = Schema({
    firstname: {
        type: Schema.Types.String
    },
    lastname: {
        type: Schema.Types.String
    },
    email: {
        type: Schema.Types.String,
        unique: true,
        required: true
    },
    username: {
        type: Schema.Types.String,
        unique: true,
        required: true,
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    teams: [{
        type: Schema.Types.ObjectId,
        ref: 'Team',
    }]
});

const User = model('User', UserSchema);

UserSchema.path('username').validate(async (value)=>{
    const usernameCount = await User.countDocuments({username:value});
    return !usernameCount;
},'Username already taken');

UserSchema.path('email').validate(async (value)=>{
    const emailCount = await User.countDocuments({email:value});
    return !emailCount;
},'Email already taken');

User.getUserByUsername = (username, callback) => {
    const query = {
        username: username
    };
    User.findOne(query, callback);
}
User.queryUsers = (text) => {
    return new Promise((res,rej)=>{
        User.find(
            {$or: [
                {username: {$regex: text,$options: 'i'}},
                {firstname: {$regex: text,$options: 'i'}},
                {lastname: {$regex: text,$options: 'i'}}
            ]}, 'firstname lastname username email _id')
            .limit(5)
            .exec((err, users) => {
                if (err) rej(err,null);
                else if (users) {
                    res(users);
                } else res([]);
            })
    })
}

User.createUser = (newUser) => {
    return new Promise((res,rej)=>{
        bcrypt.genSalt(10, (err, salt) => {
            if (err) rej(err);
            else bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) rej(err);
                else {
                    newUser.password = hash;
                    newUser.save((err,user)=>{
                        if (err) rej(err);
                        else res(user);
                    });
                }
            });
        });
    })
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
        select: 'name description _id members'
    }).exec(callback)
}
User.removeTeam = (userId, teamId, callback) => {
    User.findByIdAndUpdate(userId, {
        $pull: {
            teams: teamId
        }
    }, callback);
}

module.exports = User;