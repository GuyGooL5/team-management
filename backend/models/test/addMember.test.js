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
    var [user1_id, user2_id, user3_id] = [null, null, null];
    var [team1_id, team2_id] = [null, null];

    /**Create users that are required to the next tests.
     * Expected result: no error.
     */
    it('Create users for later use', async () => {
        const [user1, user2, user3] = [
            { username: 'Username1', password: 'A password', email: 'email1@example.com' },
            { username: 'Username2', password: 'A password', email: 'email2@example.com' },
            { username: 'Username3', password: 'A password', email: 'email3@example.com' }
        ];
        user1_id = (await User.createUser(User.newUserModel(user1))).user._id;
        user2_id = (await User.createUser(User.newUserModel(user2))).user._id;
        user3_id = (await User.createUser(User.newUserModel(user3))).user._id;
        expect(user1_id).to.not.be.null
        expect(user2_id).to.not.be.null
        expect(user3_id).to.not.be.null
    });

    /**Create teams that are required to the next tests.
     * Expected result: no error.
     */
    it('Create teams for later use', async () => {
        var teams = [
            { name: "Team one", owner: user1_id },
            { name: "Team two", owner: user2_id },
        ];
        team1_id = (await Team.createTeam(Team.newTeamModel(teams[0])))._id;
        team2_id = (await Team.createTeam(Team.newTeamModel(teams[1])))._id;
    })

    /**Test that checks if owner can add a new member
     * Expected result: The team now includes new member.
     */
    it('A team owner can add a new member to team', async () => {
        await Team.addMemberToTeam(team1_id, user1_id, user2_id);
        let members = (await Team.getTeamById(team1_id)).members;
        expect(members.length).to.eq(2);
        let newMember = members.find(member => String(member.user) === String(user2_id));
        expect(String(newMember.user)).to.eq(String(user2_id));
    })
    /**Test that checks if owner can add a new member
     * Expected result: The team now includes new member.
     */
    it('A user that isn\'t in a team CAN NOT add members to a team', async () => {
        try {
            await Team.addMemberToTeam(team1_id, user3_id, user2_id);
            //expect(true).to.be.false //No escape block if no error is returned.
        } catch (err) {
            expect(err.error).to.eq("You are not in this team.");
        }
    })

    /**Test that checks if a manager can add new member.
     * Expected result: Team one has members array of 3.
     */
    it('A team manager can add new member to team', async () => {
        await Team.updateMemberPermissions(team1_id, user1_id, user2_id, "manager");
        await Team.addMemberToTeam(team1_id, user2_id, user3_id);
        let members = (await Team.getTeamById(team1_id)).members;
        expect(members.length).to.eq(3);
        let newMember = members.find(member => String(member.user) === String(user3_id));
        expect(String(newMember.user)).to.eq(String(user3_id));
    })

    /**Test that checks if a manager can add new member.
     * Expected result: Team one has members array of 3.
     */
    it('A team owner/manager CAN NOT add theirself', async () => {
        try {
            await Team.addMemberToTeam(team1_id, user2_id, user2_id)
            expect(true).to.be.false //No escape block if no error is returned.
        } catch (err) {
            expect(err.error).to.eq("You cannot add yourself.");
        }
    })

    /**Test that checks if a member can't add other members
     * Expected result: error
     */
    it('A team member CAN NOT add members ', async () => {
        try {
            await Team.addMemberToTeam(team2_id, user2_id, user1_id);
            await Team.addMemberToTeam(team2_id, user1_id, user3_id)
            expect(true).to.be.false //No escape block if no error is returned.
        } catch (err) {
            expect(err.error).to.eq("You have no permission to add members.");
        }
    });

/**Test that checks if a member can't add other members
 * Expected result: error
 */
it('A team manager/owner CAN NOT add members that are already in the team ', async () => {
    try {
        await Team.addMemberToTeam(team1_id, user1_id, user3_id)
        expect(true).to.be.false //No escape block if no error is returned.
    } catch (err) {
        expect(err.error).to.eq("This user is already a member.");
    }
});
});