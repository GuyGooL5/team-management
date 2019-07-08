const bcrypt = require('bcryptjs');

const UserModel = require('./_userModel');

const User = {
    newUserModel: (newModel) => new UserModel(newModel),
    createUser: (newUserModel) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) reject(err);
                bcrypt.hash(newUserModel.password, salt, (err, hash) => {
                    if (err) reject(err);
                    newUserModel.password = hash;
                    newUserModel.save(err => {
                        if (err) reject(err);
                        resolve({ success: true, msg: "User Registered" })
                    });
                });
            });
        })
    },
    validateUsernameNotTaken: (username) => new Promise((resolve, reject) => {
        User.findOne({ username: username }).then(user => {
            if (user) resolve({ success: false, msg: "Username is already taken." });
            resolve({ success: true, msg: "Username is valid" })
        }).catch(err => reject(err));
    }),
    validateEmailNotTaken: (email) => new Promise((resolve, reject) => {
        User.findOne({ email: email }).then(user => {
            if (user) resolve({ success: false, msg: "Email is already taken." });
            resolve({ success: true, msg: "Email is valid" })
        }).catch(err => reject(err));
    }),
    getUserByUsername: (username) => new Promise((resolve, reject) => {
        UserModel.findOne({ username: username }).then(user => {
            if (!user) reject({ error: "No user is found" });
            resolve(user);
        }).catch(err => reject(err));
    }),
    getUserDetails: (user_id) => new Promise((resolve, reject) => {
        User.findById(user_id, 'username email firstname lastname _id').then(user => {
            if (!user) reject({ error: "No user is found" });
            resolve(user);
        }).catch(err => reject(err))
    }),
    getUserById: (user_id) => new Promise((resolve, reject) => {
        UserModel.findById(user_id).then(user => {
            if (!user) reject({ error: "No user is found" });
            resolve(user);
        }).catch(err => reject(err));
    }),
    //Return a query of 5 uers max that match the query.
    queryUsers: (text) => new Promise((resolve, reject) => {
        UserModel.find({
            $or: [
                { username: { $regex: text, $options: 'i' } },
                { firstname: { $regex: text, $options: 'i' } },
                { lastname: { $regex: text, $options: 'i' } }]
        }, 'firstname lastname username email _id').limit(5).then(users => {
            if (!users) resolve([])
            resolve(users);
        }).catch(err => reject(err));
    }),
    addUserToTeam: (user_id, team_id) => new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(user_id, { "$addToSet": { teams: team_id } }, { new: true, runValidators: true }, (err, user) => {
            if (err) reject(err);
            if (!user) reject({ success: false, msg: "User doesn't exist" });
            resolve({ success: true, msg: 'Added team to user', user: user });
        });
    }),
    removeMemberFromTeam: (user_id, team_id) => new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(user_id, { "$pull": { teams: team_id } }, (err, user) => {
            if (err) reject(err);
            if (!user) reject({ success: false, msg: "User doesn't exist" });
            resolve({ success: true, msg: 'Member removed from team.', user: user });
        });
    }),
    getUserTeamsById: (user_id) => new Promise((resolve, reject) => {
        UserModel.findById(user_id, 'teams')
            .populate({ path: 'teams', select: 'name description _id members' }).then(teams => {
                if (!teams) resolve([])
                resolve(teams)
            }).catch(err => reject(err));
    })
}
module.exports = User;