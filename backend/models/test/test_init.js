const mongoose = require('mongoose');
const UserModel = require('../_userModel')
const TeamModel = require('../_teamModel')
const config = require('../../config/database');

module.exports = {

    clearUsers: () => UserModel.remove({}),
    clearTeams: () => TeamModel.remove({}),
    initConnection: () => new Promise((resolve, reject) => {
        mongoose.connect(config.database_url_test, err => reject(err));
        mongoose.connection.once('open', err => {
            if (err) reject(err);
            console.log('Connected to DB');
            resolve();
        })
    }),
    closeConnection: () => new Promise((resolve, reject) => {
        mongoose.disconnect(err => {
            if (err) reject(err);
            console.log('Disconnected from DB');
            resolve()
        })
    })
}