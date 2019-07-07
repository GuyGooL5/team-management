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

describe('Creating new user', function () {
    this.timeout(10000);
    afterEach(function (done) {
        this.timeout(10000);
        mongoose.connection.dropCollection('users', (err) => {
            console.log('DB CLEAR');
            done()
        });
    })
    //Test that server returns a user when registering new user
    it('Create with all fields', async () => {
        const newUser = new User({
            firstname: 'First',
            lastname: 'Last',
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let response = await User.createUser(newUser);
        expect(response.username).to.eql('Username');
    })
    it('Create with only required fields', async () => {
        const newUser = new User({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let response = await User.createUser(newUser);
        expect(response.username).to.eql('Username');
    })

    it('Creates a hashed password', async () => {
        const newUser = new User({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let user = await User.createUser(newUser);
        expect(user.password).to.match(/^\$2a\$10\$.{53}$/);
    })
    it('Returns error when registring duplicate Username', async () => {
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
        await User.createUser(userOne);
        await User.createUser(userTwo)
            .catch(err => expect(err.name).to.equal('ValidationError'));
    })
    it('Returns error when registring duplicate Email', async () => {
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
        await User.createUser(userOne);
        await User.createUser(userTwo)
            .catch(err => expect(err.name).to.equal('ValidationError'));
    })
});


describe('Finding user search queries', function () {
    this.timeout(10000);

    it('Create three users to test on', async () => {
        let [user1, user2, user3] = [{
                username: 'Username1',
                password: 'A password',
                email: 'email1@example.com'
            },{
                username: 'Username2',
                password: 'A password',
                email: 'email2@example.com'
            },{
                username: 'Username3',
                password: 'A password',
                email: 'email3@example.com'
            }];
        await User.createUser(new User(user1));
        await User.createUser(new User(user2));
        await User.createUser(new User(user3));
    })

    it('Query Usernames with Existing semi-string',async()=>{
        let users = await User.queryUsers('Username');
        expect(users.length).to.eq(3);
    })
    it('Query Usernames with Full Username',async()=>{
        let users = await User.queryUsers('Username1');
        expect(users.length).to.eq(1);
    })
    it('Return empty list with Non-existent query search',async()=>{
        let users= await User.queryUsers('!@#$%^');
        expect(users).to.be.empty;
    })
})