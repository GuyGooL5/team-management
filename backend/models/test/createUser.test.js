/**Unit tests for user creation on database.
 */
const { expect } = require('chai')

const User = require('../user');

const { initConnection, clearUsers, closeConnection } = require('./test_init');

describe('Creating new user', function () {
    this.timeout(10000);
    before(async () => {
        await initConnection();
        clearUsers();
    })
    afterEach(async () => {
        await clearUsers();
    })
    after(async () => {
        await clearUsers();
        closeConnection();
    })

    /**Test that all fields let the database create a new user.
     * Expected result is a user object that contains said fields
     * The test will compare one field <username> of the request
     *  with the result and see if it matches.
     */
    it('Create with all fields', async () => {
        const newUser = User.newUserModel({
            firstname: 'First',
            lastname: 'Last',
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let response = await User.createUser(newUser);
        expect(response.user.username).to.eql('Username');
    })

    /**Test that only required fields are enough to create a new user.
     *The test's expected results are the same as before.
     */
    it('Create with only required fields', async () => {
        const newUser = User.newUserModel({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let response = await User.createUser(newUser);
        expect(response.user.username).to.eql('Username');
    })

    /**Test that the password generated when creating new user
     *  is really a hashed password that matches the regular expression.
     */
    it('Creates a hashed password', async () => {
        const newUser = User.newUserModel({
            username: 'Username',
            password: 'A password',
            email: 'email@example.com'
        })
        let response = await User.createUser(newUser);
        expect(response.user.password).to.match(/^\$2a\$10\$.{53}$/);
    })

    /**Test to see if error is returning, and user is not created when
     * a required field is missing.
     * This one tests the request without <username>
     */
    it('Returns error when registring non-existent required field(username)', async () => {
        const newUser = User.newUserModel({
            //no username
            password: 'A password',
            email: "email@example.com"
        });
        await User.createUser(newUser).catch(err => {
            expect(err).to.not.be.null;
        })
    })

    /**Test to see if error is returning, and user is not created when
     * a required field is missing.
     * This one tests the request without <password>
     */
    it('Returns error when registring non-existent required field(password)', async () => {
        const newUser = User.newUserModel({
            username: 'Username',
            //no password
            email: "email@example.com"
        });
        await User.createUser(newUser).catch(err => {
            expect(err).to.not.be.null;
        })
    })

    /**Test to see if error is returning, and user is not created when
     * a required field is missing.
     * This one tests the request without <email>
     */
    it('Returns error when registring non-existent required field(email)', async () => {
        const newUser = User.newUserModel({
            username: 'Username',
            password: "A password"
            //no password
        });
        await User.createUser(newUser).catch(err => {
            expect(err).to.not.be.null;
        })
    })

    /**Test to see if the database doesn't created two identical usernames.
     * Expected result is returning error.
     */
    it('Returns error when registring duplicate Username', async () => {
        const userOne = User.newUserModel({
            username: 'Username',
            password: 'A password',
            email: 'email1@example.com'
        });
        const userTwo = User.newUserModel({
            username: 'Username',
            password: 'A password',
            email: 'email1@example.com'
        });
        await User.createUser(userOne);
        await User.createUser(userTwo)
            .catch(err => expect(err.name).to.equal('ValidationError'));
    })

    /**Test to see if the database doesn't created two identical emails.
     * Expected result is returning error.
     */
    it('Returns error when registring duplicate Email', async () => {
        const userOne = User.newUserModel({
            username: 'Username1',
            password: 'A password',
            email: 'email@example.com'
        });
        const userTwo = User.newUserModel({
            username: 'Username2',
            password: 'A password',
            email: 'email@example.com'
        });
        await User.createUser(userOne);
        await User.createUser(userTwo)
            .catch(err => expect(err.name).to.equal('ValidationError'));
    })
});