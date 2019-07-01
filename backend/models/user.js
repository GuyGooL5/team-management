const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');
const Team = require('./teams');
//User Schema
const UserSchema = Schema({
    firstname:{
        type: String
    },
    lastname:{
        type: String
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    teams:[{type:Schema.Types.ObjectId,ref:'Team'}]
});

const User = module.exports = model('User',UserSchema);

module.exports.getUserById = (id,callback)=>{
    User.findById(id,callback);
};
module.exports.getUserByUsername = (username,callback)=>{
    const query = {username:username};
    User.findOne(query,callback);
}

module.exports.addUser=(newUser,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        if(err) throw err;
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save((err,user)=>{
                callback(err,user);
            });
        });
    });
}
module.exports.getTeams=(callback)=>{
    User.findById(id,'teams',teams=>{
    })
}

module.exports.comparePassword=(candid,hash,callback)=>{
    bcrypt.compare(candid,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    })
}