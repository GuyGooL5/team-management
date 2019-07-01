const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const config = require('../config/database');

const User = require('./user');
//Team Schema

const TeamSchema = Schema({
    name:String,
    description:String,
    owner:{
        type:Schema.Types.ObjectId,
        require:true,
    },
    members:[{type:Schema.Types.ObjectId,permission:'String',ref:'User'}]
});

const Team = module.exports = model('Team',TeamSchema);

module.exports.getTeamByID = (id,callback)=>{
    Team.findById(id,callback);
};
module.exports.getTeamMembers = (username,callback)=>{
    const query = {member:username};
    User.findOne(query,callback);
}
module.exports.addUser=(newUser,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        if(err) throw err;
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password=hash;
            newUser.save(callback);
        });
    });
}


module.exports.comparePassword=(candid,hash,callback)=>{
    bcrypt.compare(candid,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    })
}