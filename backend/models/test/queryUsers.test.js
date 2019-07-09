/**Unit tests for querying all users with matching strings on database.
 */
const { expect } = require('chai')

const User = require('../user');

const { initConnection, clearUsers, closeConnection } = require('./test_init');

describe('Finding user search queries', function () {
    this.timeout(10000);

    before(async () => {
        await initConnection();
        await clearUsers();
    });
    after(async () => {
        await clearUsers();
        closeConnection()
    })

    /**Inital test to push three new entries to database
     * to test on later.
     * Excected result that no error is returned.
     */
    it('Create three users to test on', async () => {
        let error = null;
        let [user1, user2, user3] = [{
            username: 'Username1',
            password: 'A password',
            email: 'email1@example.com'
        }, {
            username: 'Username2',
            password: 'A password',
            email: 'email2@example.com'
        }, {
            username: 'SomeName',
            password: 'A password',
            email: 'email3@example.com'
        }];
        await User.createUser(User.newUserModel(user1)).catch(err => { error = err });
        await User.createUser(User.newUserModel(user2)).catch(err => { error = err });
        await User.createUser(User.newUserModel(user3)).catch(err => { error = err });
        expect(error).to.be.null;

    })

    /**Test to see if the query matches all entries.
     * Expected result: the whole array is returned.
     */
    it('Query Usernames with string that matches all entries', async () => {
        let users = await User.queryUsers('m');
        expect(users.length).to.eq(3);
    })

    /**Test to see if the query matches only some entries.
     * Expected result: only two entries are returned.
     */
    it('Query Usernames with string that matches some entries', async () => {
        let users = await User.queryUsers('Username');
        expect(users.length).to.eq(2);
    })

    /**Test to see if the query matches exactly one entry.
     * Expected result: only one entry is returned.
     */
    it('Query Usernames with string that has only one match', async () => {
        let users = await User.queryUsers('Username1');
        expect(users.length).to.eq(1);
    })

    /**Test to see if the query has no match at all.
     * Expected result: empty array.
     */
    it('Query Usernames with string that has no match', async () => {
        let users = await User.queryUsers('!@#$%^');
        expect(users).to.be.empty;
    })
})