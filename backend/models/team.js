const {
    Schema,
    model,
    Types
} = require('mongoose');
const UserModel = require('./_userModel');
const User = require('./user');

const TeamModel = require('./_teamModel');


const Team = {
    //Creates a new team model.
    newTeamModel: (newModel) => new TeamModel(newModel),

    //Creates a new team, given a team Model object
    createTeam: (newTeamModel) => new Promise((resolve, reject) => {
        newTeamModel.save((err, team) => {
            if (err) reject(err);
            if(!team) reject({error:"Team not created"});
            resolve(team);
        });
    }),
    getTeamById: (team_id) => new Promise((resolve, reject) => {
        TeamModel.findById(team_id).then(team => {
            if (!team) reject({ error: "Team not found" });
            resolve(team);
        }).catch(err => reject(err));
    }),
    //Gets two parameters, team_id and user_id to compare if the user is the owner of the team.
    deleteTeam: (team_id, owner_id) => new Promise((resolve, reject) => {
        TeamModel.findById(team_id, '_id owner', (err, team) => {
            if (err) reject(err);
            else if (team) {
                if (String(owner_id) === String(team.owner)) {
                    team.remove((err, team) => {
                        if (err) reject(err)
                        else if (team) resolve({ success: true, msg: "team deleted succesfully" });
                        else reject({ error: "Error occoured while deleting team" })
                    })
                } else reject({ error: "Only the owner can remove the team." });
            } else reject({ error: "Team not found." });
        })
    }),
    addMemberToTeam: (team_id, issuer_id, member_id) => new Promise((resolve, reject) => {
        if (issuer_id === member_id) reject({ error: "You cannot add yourself" });
        TeamModel.findOne({ _id: team_id, "members.user": issuer_id }, '_id members.user members.permission', (err, team) => {
            if (err) reject(err);
            if (!team) reject({ error: "You are not in this team" });
            //find the issuer in the team
            const { permission } = team.members.find(member => String(member.user) === String(issuer_id));
            const isNewMember = !team.members.find(member => String(member.user) === String(member_id));
            if (!isNewMember) reject({ error: "This user is already a member" });
            if (permission !== "owner" && permission !== "manager") reject({ error: "You have no permission to add members." });

            //finding the member
            User.addUserToTeam(member_id, team_id).then(success => {
                TeamModel.findByIdAndUpdate(team_id, { $addToSet: { members: { user: member_id, since: new Date, permission: 'member' } } }).then(team => {
                    if (!team) reject({ error: "Team not found" });
                    resolve(success);
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        })
    }),

    removeMemberFromTeam: (team_id, issuer_id, member_id) => new Promise((resolve, reject) => {
        if (issuer_id === member_id) reject({ error: "You cannot Remove yourself" });
        TeamModel.findOne({ _id: team_id, "members.user": issuer_id }, '_id members.user members.permission', (err, team) => {
            if (err) reject(err);
            if (!team) reject({ error: "You are not in this team" });
            //find the issuer in the team
            const { permission } = team.members.find(member => String(member.user) === String(issuer_id));
            const isNewMember = !team.members.find(member => String(member.user) === String(member_id));
            if (isNewMember) reject({ error: "This user is not a member in this team." });
            if (permission !== "owner" && permission !== "manager") reject({ error: "You have no permission to remove members." });
            User.removeMemberFromTeam(member_id, team_id).then(success => {
                TeamModel.findByIdAndUpdate(team_id, { $pull: { members: { user: member_id } } }).then((team) => {
                    if (!team) reject({ error: "Team not found" });
                    resolve(success);
                }).catch(err => reject(err));
            }).catch(err => reject(err));
        })
    }),
    updateMemberPermissions: (team_id, issuer_id, member_id, newPermission) => new Promise((resolve, reject) => {
        if (issuer_id == member_id) reject({ error: "You cannot change your own permissions" });
        TeamModel.findById(team_id, '_id members.user members.permission', (err, team) => {
            if (err) reject(err);
            if (!team) reject({ error: "Team not found" });
            const { permission } = team.members.find(member => String(member.user) === String(issuer_id));
            const targetMember = team.members.find(member => String(member.user) === String(member_id));
            if (member_id === team.owner) reject({ error: "You can't change owner's permissions" });
            if (!targetMember) reject({ error: "This user is not a member in this team." });
            if (permission !== "owner" && permission !== "manager") reject({ error: "You have no permission to change permissions." });
            if (targetMember.permission === newPermission) reject({ error: "This member's permission is already: " + newPermission });
            TeamModel.findByIdAndUpdate(team_id, { "$set": { "members.$[i].permission": newPermission } }, { arrayFilters: [{ "i.user": member_id }] }).then(team => {
                if (!team) reject({ error: "Team not found" });
                resolve({ success: true, msg: "Updated Member's permissiom" });
            }).catch(err => reject(err));
        })
    }),

    //Get a list of all the members of a team.
    getTeamDetails: (team_id) => new Promise((reject, resolve) => {
        TeamModel.findById(team_id, '_id owner name description members.user members.since members.permission')
            .populate('owner', '_id firstname lastname username email')
            .populate('members.user', '_id firstname lastname username email')
            .then(team => {
                if(!team) reject({error:"Team not found"});
                resolve(team);
            }).catch(err=>reject(err));
    })
}
module.exports = Team;