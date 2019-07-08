/**Unit tests for user creation on database.
 */
const { expect } = require('chai')

const User = require('../user');
const Team = require('../team');

const clearDB = require('./test_init');

describe('Creating new team', function () {
    this.timeout(10000);
    before(async()=>{
        clearDB('users');
        clearDB('teams');
    })
    afterEach(function (done) {
        this.timeout(10000);
        clearDB('teams', done);
    })

    var user_id = null;

    /**Create a user to have the teams.
     * Expected result: no error.
     */
    it('Create a user to later use', async () => {
        let error = null;
        let user = User.newUserModel({
            username: 'Username1',
            password: 'A password',
            email: 'email1@example.com'
        });
        user = await User.createUser(user);
        user_id = user._id;
        expect(user.username).to.eq('Username1');
    })

    /**Test to see if a team is created with all fields
     * Expected result: No error and a team object that matches the request.
     */
    it('Create a new team with all fields present', async () => {
        let team = Team.newTeamModel({
            name: 'Team name',
            description: 'Team description',
            owner: user_id
        })
        team = await Team.createTeam(team);
        expect(team.name).to.eq('Team name')
    })

    /**Test to see if a team is created by only the required fields
     * Expected result: No error and a team object that matches the request.
     */
    it('Create a new team with only required fields', async () => {
        let team = Team.newTeamModel({
            name: 'Team name',
            owner: user_id
        })
        team = await Team.createTeam(team);
        expect(team.name).to.eq('Team name')
    })

    /**Test to see if error is returned when <name> field is missing
     * Expected result: error on the creation request.
     */
    it('Create a new team with all only required fields', async () => {
        let team = Team.newTeamModel({
            owner: user_id
        })
        team = await Team.createTeam(team).catch(err => {
            expect(err).to.not.be.null;
        })
    })

    /**Test to see if error is returned when <name> field is missing
     * Expected result: error on the creation request.
     */
    it('Returns error with missing field <name>', async () => {
        let team = Team.newTeamModel({
            owner: user_id
        });
        try{
            await Team.createTeam(team);
        }
        catch(err){
            expect(err).to.not.be.null;
        }
    })

    /**Test to see if error is returned when <owner> field is missing
     * Expected result: error on the creation request.
     */
    it('Returns error with missing field <owner>', async () => {
        let team = Team.newTeamModel({
            name: 'Team name'
        });

        try{
            await Team.createTeam(team);
            expect(true).to.be.false // No escape from rejection
        }
        catch(err){
            expect(err.error).to.eq("No team owner");
        }
    })

    /**Test to see if error is returned when <owner> field is in invalid format
     * Expected result: error on the creation request.
     */
    it('Returns error with inavlid field <owner>', async () => {
        let team = Team.newTeamModel({
            name: 'Team name',
            owner: 'invalid#!!@$!@'
        });
        try{
            await Team.createTeam(team);
        }
        catch(err){
            expect(err.name).to.eq('ValidationError');
        }
    })

    /**Test to see if error is returned when <owner> field
     *  is valid but points to non existent user.
     * Expected result: error on the creation request.
     */
    it('Returns error when <owner> is non existent user id', async () => {
        let team = Team.newTeamModel({
            name: 'Team name',
            owner: '000000000000000000000000'
        });
        try{
            await Team.createTeam(team);
        }
        catch(err){
            expect(err.error).to.eq('Wrong owner id');
        }
    });

    /**Test to see if the creation of the team passes a reference 
     * to the user's teams field.
     * Expected result: team id should be inside user's teams
     */
    it('Creates a team reference in a user\'s document', async () => {
        let team = Team.newTeamModel({
            name: 'Team name',
            owner: user_id
        });
        team = await Team.createTeam(team)
        let user = await User.getUserById(user_id);
        expect(user.teams).to.include(team._id);
    })
});