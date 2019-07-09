const { Schema, model } = require('mongoose');

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
        ref: 'Team'
    }]
});

const UserModel = model('User', UserSchema);

UserSchema.path('username').validate(async (value) => {
    const usernameCount = await UserModel.countDocuments({ username: value });
    return !usernameCount;
}, 'Username already taken');

UserSchema.path('email').validate(async (value) => {
    const emailCount = await UserModel.countDocuments({ email: value });
    return !emailCount;
}, 'Email already taken');

module.exports = UserModel;