const {
    Schema,
    model,
    Types
} = require('mongoose');
const User = require('./user');

//Team Schema
const MemberSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    since: Schema.Types.Date,
    permission: String
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
    teamId = Types.ObjectId(teamId);
    Team.findById(teamId, (err, team) => {
        if (err) {
            callback(err, false);
        } else if (team) {
            console.log(team);
        }
    }).catch(err => {
        console.log(err);
    })
}
Team.createTeam = (newTeam, callback) => {
    newTeam.save((err, team) => {
        callback(err, team);
    });
}

Team.deleteTeam = (teamId, ownerId, callback) => {
    Team.findById(teamId,'_id owner', (err, team) => {
        if (err) callback(err);
        if (team) {
            if (String(ownerId) == String(team.owner)) {
                team.remove((err, team) => {
                    if (err) callback(err)
                    if (team) {
                        User.removeTeam(team.owner, team._id, (err, user) => {
                            callback(null, true);
                        })
                    } else callback({
                        error: "Error occoured while deleting team"
                    })
                })
            }
        } else callback({
            error: "Team not found."
        }, false);
    })
}
Team.addMember = (teamId,issuerId,memberId,callback)=>{
    if (issuerId==memberId) callback({error:"You cannot add yourself"},null);
    else Team.findById(teamId,'_id members.user members.permission', (err,team)=>{
        if(err) callback(err,null);
        else if(team){
            let issuer = team.members.find(obj=>{
                return String(obj.user)==String(issuerId);
            })
            if(issuer.permission=="manager" || issuer.permission == "owner"){
                //find if member exists
                User.findById(memberId,(err,user)=>{
                    if(err) callback(err,null);
                    //logic if member exists
                    else if(user){
                        //test to see if the user isn't already in that team
                        if(user.teams.includes(team._id)) callback({error:"This member is already in this team"});
                        else {
                            user.teams.push(team._id);
                            user.save((err,user)=>{
                                if(err) callback(err,null);
                                else if(user){
                                    //test if team has been added to user
                                    if(user.teams.includes(team._id)){
                                        team.members.push({
                                            user:user._id,
                                            since:new Date(),
                                            permission:'member'
                                        });
                                        team.save((err,team)=>{
                                            if(err) callback(err,null);
                                            else if(team){
                                                callback(null,true)
                                            }
                                        })
                                    }

                                }else callback({error:"Internal Error"},null);
                            })
                        }
                    }
                    //return if member doesn't exist on the database
                    else callback({error:"Target member not found"},false);
                })

            }else callback({error:"You have no permission to add members"},false);
        }
        else callback({error:"Team not found"});
    })
}

Team.permitMember = (teamId,issuerId,memberId,permission,callback)=>{
    if (issuerId==memberId) callback({error:"You cannot promote yourself"},null);
    else Team.findById(teamId,'_id members.user members.permission', (err,team)=>{
        if(err) callback(err,null);
        else if(team){
            let issuer = team.members.find(obj=>{
                return String(obj.user)==String(issuerId);
            })
            if(issuer.permission=="manager" || issuer.permission == "owner"){
                //find if member exists
                User.findById(memberId,(err,user)=>{
                    if(err) callback(err,null);
                    //logic if member exists
                    else if(user){
                        //test to see if the user is in that team
                        if(user.teams.includes(team._id)) {
                            team.members.forEach(obj=>{
                                if(String(obj.user) == String(user._id)){
                                    obj.permission=permission;
                                }
                            })
                            team.save((err,team)=>{
                                if (err) callback(err)
                                else if (team){
                                    callback(null,true);
                                }
                            })
                        }
                        else callback({error:"This member is not in this team"});

                    }
                    //return if member doesn't exist on the database
                    else callback({error:"Target member not found"},false);
                })

            }else callback({error:"You have no permission to promote users"},false);
        }
        else callback({error:"Team not found"});
    })
}
Team.removeMember = (teamId,issuerId,memberId,callback)=>{
    if (issuerId==memberId) callback({error:"You cannot remove yourself"},null);
    else Team.findById(teamId,'_id members.user members.permission', (err,team)=>{
        if(err) callback(err,null);
        else if(team){
            let issuer = team.members.find(obj=>{
                return String(obj.user)==String(issuerId);
            })
            if(issuer.permission=="manager" || issuer.permission == "owner"){
                //find if member exists
                User.findById(memberId,(err,user)=>{
                    if(err) callback(err,null);
                    //logic if member exists
                    else if(user){
                        //test to see if the user is already in that team
                        if(user.teams.includes(team._id)){
                            //remove the team reference from the user
                            user.teams = user.teams.filter(el=>{
                                return String(el)!==String(team._id);
                            })
                            user.save((err,user)=>{
                                if(err) callback(err,null);
                                else if(user){
                                    //test to see if the team is really not present
                                    if(!user.teams.includes(team._id)){
                                        console.log(team.members);
                                        team.members = team.members.filter(obj=>{
                                            return String(obj.user)==String(issuerId);
                                        })
                                        team.save((err,team)=>{
                                            if(err) callback(err,null)
                                            else if(team) callback(null,true);
                                        })
                                    }
                                }
                                else callback({error:"Internal Error"});
                            })
                        }
                        else callback({error:"This member is not in this team"});
                    }
                    //return if member doesn't exist on the database
                    else callback({error:"Target member not found"},false);
                })

            }else callback({error:"You have no permission to remove members"},false);
        }
        else callback({error:"Team not found"});
    })
}

module.exports = Team;