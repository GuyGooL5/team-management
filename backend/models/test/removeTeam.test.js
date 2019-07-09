/**Unit tests for user creation on database.
 */
const { expect } = require('chai')

const User = require('../user');
const Team = require('../team');

const { initConnection, clearTeams, clearUsers, closeConnection } = require('./test_init');

describe('Remove team', function () {

    this.timeout(10000);
    before(async () => {
        await initConnection();
        await clearTeams();
        await clearUsers();
    });
    after(async () => {
        await clearTeams();
        await clearUsers();
        closeConnection();
    });

    var [user1_id, user2_id] = [null, null];
    var [team1_id, team2_id, team3_id] = [null, null, null];

    /**Create a user that is required to the next tests.
     * Expected result: no error.
     */
    it('Create a user to later use', async () => {
        const user1 = {
            username: 'Username1',
            password: 'A password',
            email: 'email1@example.com'
        }
        const user2 = {
            username: 'Username2',
            password: 'A password',
            email: 'email2@example.com'
        }
        user1_id = (await User.createUser(User.newUserModel(user1))).user._id
        user2_id = (await User.createUser(User.newUserModel(user2))).user._id
        expect(user1_id).to.not.be.null
        expect(user2_id).to.not.be.null
    })

    /**Create three teams that are required to the next tests.
     * Expected result: no error.
     */
    it('Create 3 teams for later use', async () => {
        let teams = [
            { name: "Team one", owner: user1_id },
            { name: "Team two", owner: user1_id },
            { name: "Team three", owner: user1_id }];
        team1_id = (await Team.createTeam(Team.newTeamModel(teams[0])))._id;
        team2_id = (await Team.createTeam(Team.newTeamModel(teams[1])))._id;
        team3_id = (await Team.createTeam(Team.newTeamModel(teams[2])))._id;
        await Team.addMemberToTeam(team3_id, user1_id, user2_id)
    })

    /**Test to see if a deleted team returns a success: true
     * Expected result: no error.
     */
    it('A team is deleted by it\'s owner', async () => {
        let deletedTeam = await Team.deleteTeam(team1_id, user1_id);
        expect(deletedTeam.success).to.be.true;
    })

    /**Test to see the team cannot be deleted by someone who isn't the owner
     * Expected result: returned error.
     */
    it('A team is NOT deleted by someone else from the team', async () => {
        Team.deleteTeam(team2_id, user2_id).catch(err => {
            expect(err.error).to.eq('Only the owner can remove the team.');
        })
    })

    /**Test to see the team cannot be deleted by someone who isn't in the team
     * Expected result: returned error.
     */
    it('Returns an error if the team doesn\'t exist', async () => {
        Team.deleteTeam('000000000000000000000000', user1_id).catch(err => {
            expect(err.error).to.eq('Team not found.');
        })
    })

    /**Test to see that all the team's members have it's reference;
     * Expected result: The team reference found in both members.
     */
    it('A reference exists on all team users', async () => {
        expect((await User.getUserById(user1_id)).teams.includes(team3_id)).to.be.true
        expect((await User.getUserById(user2_id)).teams.includes(team3_id)).to.be.true
    })

    /**Test to see if deleted team deletes it's reference from it's users;
     * Expected result: returned error.
     */
    it('A deleted team also deletes it\'s references to all other members', async () => {
        await Team.deleteTeam(team3_id, user1_id);
        expect((await User.getUserById(user1_id)).teams.includes(team3_id)).to.be.false
        expect((await User.getUserById(user2_id)).teams.includes(team3_id)).to.be.false
    });
});