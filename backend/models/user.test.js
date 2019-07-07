const {
    expect,
    should
} = require('chai')
const mongoose = require('mongoose');

const config = require('../config/database');
const User = require('./user');




before(function (done) {
    this.timeout(10000);
    mongoose.connect(config.database_url_test);

    mongoose.connection.once('open', (err, res) => {
        if (err) throw (err);
        else mongoose.connection.dropCollection('users', (err) => {
            console.log('connected to DB and deleted users');
            done();
        });
    })
})

after(function (done) {
    this.timeout(10000);
    mongoose.connection.dropCollection('users', (err) => {
        mongoose.disconnect(() => {
            console.log('successfuly disconnected');
            done();
        });
    });
})

afterEach(function (done) {
    this.timeout(10000);
    mongoose.connection.dropCollection('users', (err) => {
        done()
    });
})

describe('Creating new user', () => {

    //Test that server returns a user when registering new user
    it('Create with all fields', (done) => {
        const newUser = new User({
            firstname: 'First',
            lastname: 'Last',
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        User.createUser(newUser, (err, user) => {
            expect(user.username).to.eq('Username');
            done();
        });
    }).timeout(10000);
    it('Create with only required fields', (done) => {
        const newUser = new User({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        User.createUser(newUser, (err, user) => {
            expect(user.username).to.eq('Username');
            done();
        });
    }).timeout(10000);

    it('Creates a hashed password', (done) => {
        const newUser = new User({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        User.createUser(newUser, (err, user) => {
            expect(user.password).to.be.string
            done();
        });

    }).timeout(10000);
    it('Returns error when registring duplicate Username', (done) => {
        const userOne = new User({
            username: 'Username',
            password: 'A password',
            email: 'email1@example.com'
        });
        const userTwo = new User({
            username: 'Username',
            password: 'A password',
            email: 'email1@example.com'
        });
        User.createUser(userOne, (err1) => {
            User.createUser(userTwo, (err2, user2) => {
                expect(err2.name).to.equal('ValidationError');
                done();
            });
        });
    }).timeout(10000);
    it('Returns error when registring duplicate Email', (done) => {
        const userOne = new User({
            username: 'Username1',
            password: 'A password',
            email: 'email@example.com'
        });
        const userTwo = new User({
            username: 'Username2',
            password: 'A password',
            email: 'email@example.com'
        });
        User.createUser(userOne, (err1) => {
            User.createUser(userTwo, (err2, user2) => {
                expect(err2.name).to.equal('ValidationError');
                done();
            });
        });
    }).timeout(10000);
});