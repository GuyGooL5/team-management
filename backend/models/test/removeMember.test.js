/**Unit tests for user creation on database.
 */
const { expect } = require('chai')

const User = require('../user');
const Team = require('../team');

const { initConnection, clearTeams, clearUsers, closeConnection } = require('./test_init');

describe('Remove members from teams.', function () {

    this.timeout(10000);
    before(async () => {
        await initConnection();
        await clearTeams()
        await clearUsers()
    });
    after(async () => {
        await clearTeams()
        await clearUsers()
        await closeConnection();
    })
    let [user1_id, user2_id, user3_id, user4_id] = [null, null, null, null];
    let [team1_id, team2_id] = [null, null];

    /**Create users that are required to the next tests.
     * Expected result: no error.
     */
    it('Create users for later use', async () => {
        const [user1, user2, user3, user4] = [
            { username: 'Username1', password: 'A password', email: 'email1@example.com' },
            { username: 'Username2', password: 'A password', email: 'email2@example.com' },
            { username: 'Username3', password: 'A password', email: 'email3@example.com' },
            { username: 'Username4', password: 'A password', email: 'email4@example.com' }];

        user1_id = (await User.createUser(User.newUserModel(user1))).user._id;
        user2_id = (await User.createUser(User.newUserModel(user2))).user._id;
        user3_id = (await User.createUser(User.newUserModel(user3))).user._id;
        user4_id = (await User.createUser(User.newUserModel(user4))).user._id;
    });

    /**Create teams that are required to the next tests.
     * Expected result: no error.
     */
    it('Create teams for later use', async () => {
        let teams = [{ name: "Team one", owner: user1_id }, { name: "Team two", owner: user2_id }];
        team1_id = (await Team.createTeam(Team.newTeamModel(teams[0])))._id;
        team2_id = (await Team.createTeam(Team.newTeamModel(teams[1])))._id;
        await Team.addMemberToTeam(team1_id, user1_id, user2_id);
        await Team.addMemberToTeam(team1_id, user1_id, user3_id);
        await Team.addMemberToTeam(team1_id, user1_id, user4_id);

        await Team.addMemberToTeam(team2_id, user2_id, user1_id);
        await Team.addMemberToTeam(team2_id, user2_id, user3_id);
        await Team.updateMemberPermissions(team2_id, user2_id, user1_id, "manager");
    })

    /**Test that checks if owner can promote member to manager
     * Expected result: The removed member is not found in team members list.
     */
    it('A team owner removes a member from team', async () => {
        await Team.removeMemberFromTeam(team1_id, user1_id, user2_id);
        let { members } = await Team.getTeamById(team1_id);
        let saidMember = members.find(member => String(member.user) === String(user2_id));
        expect(saidMember).to.be.undefined;
    })

    /**Test that checks if a only the said member is removed from the team.
     * Expected result: Team one has members array of 3.
     */
    it('Once a team member is removed, all the other members are still in the team', async () => {
        let { members } = await Team.getTeamById(team1_id);
        expect(members.length).to.eq(3);
    })

    /**Test that checks if manager can remove a member
     * Expected result: The removed member is not found in team members list.
     */
    it('A team manager removes a member from team', async () => {
        await Team.removeMemberFromTeam(team2_id, user1_id, user3_id);
        let { members } = await Team.getTeamById(team2_id);
        let saidMember = members.find(member => String(member.user) === String(user3_id));
        expect(saidMember).to.be.undefined;
    })
    /**Test that checks if a member can't remove other members
     * Expected result: error
     */
    it('A team member CAN NOT remove members ', async () => {
        try {
            await Team.removeMemberFromTeam(team1_id, user3_id, user4_id)
            expect(true).to.be.false //No escape block if no error is returned.
        } catch (err) {
            expect(err.error).to.eq("You have no permission to remove members.");
        }
    });
});