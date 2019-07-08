/**Unit tests for user creation on database.
 */
const { expect } = require('chai')

const User = require('../user');
const Team = require('../team');

const clearDB = require('./test_init');

describe('Change permissions', function () {

    this.timeout(10000);
    before(async () => {
        await clearDB('tests', null, true)
        await clearDB('users', null, true)
    });

    let [user1_id,user2_id,user3_id] = [null,null,null];
    let [team1_id, team2_id] = [null, null];

    /**Create a user that is required to the next tests.
     * Expected result: no error.
     */
    it('Create users for later use', async () => {
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
        const user3 = {
            username: 'Username3',
            password: 'A password',
            email: 'email3@example.com'
        }

        user1_id = (await User.createUser(User.newUserModel(user1)))._id;
        user2_id = (await User.createUser(User.newUserModel(user2)))._id;
        user3_id = (await User.createUser(User.newUserModel(user3)))._id;
    });

    /**Create three teams that are required to the next tests.
     * Expected result: no error.
     */
    it('Create 2 teams for later use', async () => {
        let teams = [{ name: "Team one", owner: user1_id },{ name: "Team two", owner: user2_id }];
        team1_id = (await Team.createTeam(Team.newTeamModel(teams[0])))._id;
        team2_id = (await Team.createTeam(Team.newTeamModel(teams[1])))._id;
        await Team.addMemberToTeam(team1_id, user1_id, user2_id)
        await Team.addMemberToTeam(team2_id, user2_id, user1_id)
        await Team.addMemberToTeam(team2_id, user2_id, user3_id)
    })

    /**Test that checks if owner can promote member to manager
     * Expected result: success == true.
     */
    it('A team owner promotes a member to manager', async () => {
        await Team.updateMemberPermissions(team1_id,user1_id,user2_id,"manager");
        let {members}=await Team.getTeamById(team1_id);
        let saidMember = members.find(member=>String(member.user)===String(user2_id));
        expect(saidMember.permission).to.eq('manager');

    })

    /**Test that checks if owner can demote manger to member
     * Expected result: success == true.
     */
    it('A team owner demotes a manager to member', async () => {
        await Team.updateMemberPermissions(team1_id,user1_id,user2_id,"member");
        let {members}=await Team.getTeamById(team1_id);
        let saidMember = members.find(member=>String(member.user)===String(user2_id));
        expect(saidMember.permission).to.eq('member');
    })
    /**Test that checks if a member can't change permissions
     * Expected result: error
     */
    it('A team manager can promote members ', async () => {
            await Team.updateMemberPermissions(team2_id,user2_id,user1_id,"manager");
            await Team.updateMemberPermissions(team2_id,user1_id,user3_id,"manager");
            let {members}=await Team.getTeamById(team2_id);
            let saidMember = members.find(member=>String(member.user)===String(user3_id));
            expect(saidMember.permission).to.eq('manager');
        
    })

    /**Test that checks if a managert can set already set permission
     * Expected result: eroor
     */
    it('A team manager CAN NOT set an already set permission ', async () => {
        try{
            await Team.updateMemberPermissions(team1_id,user1_id,user2_id,"member")
            expect(true).to.eq(false); //Here to not bypass catch block if something goes wrong.
        }catch(err){            
            expect(err.error).to.eq("This member's permission is already: member");
        }
    })
    /**Test that checks if a member can't change permissions
     * Expected result: error
     */
    it('A team member CAN NOT set any permissions ', async () => {
        await Team.updateMemberPermissions(team2_id,user2_id,user3_id,"member")
        try{
            await Team.updateMemberPermissions(team2_id,user3_id,user1_id,"member")
            expect(true).to.eq(false); //Here to not bypass catch block if something goes wrong.
        }catch(err){            
            expect(err.error).to.eq("You have no permission to change permissions.");
        }
    })
});