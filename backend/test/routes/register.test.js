const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const clearDB = require('../test_init');


describe('Testing /api/users/register', function () {
    this.timeout(10000);
    const requester = chai.request('http://localhost:3300').keepOpen();
    afterEach((done) => {
        clearDB('users', done, true);
    })
    after(() => requester.close());
    it('Returns error with no body present', (done) => {
        chai.request('http://localhost:3300')
            .post('/api/users/register')
            .end((err, res) => {
                expect(res.badRequest).to.be.true;
                expect(res.status).to.eq(400);
                done();
            })
    })
    it('Returns success with new valid user data with all fields', (done) => {
        chai.request('http://localhost:3300')
            .post('/api/users/register')
            .send({
                firstName: 'Firstname',
                lastName: 'Lastname',
                username: 'Username1',
                email: 'email@example.com',
                password: 'NewPassword'
            })
            .end((err, res) => {
                expect(res.status).to.eq(200);
                let response = JSON.parse(res.text);
                expect(response.success).to.be.true;
                done();
            })
    })
    it('Returns success with new valid user data with only required fields', (done) => {
        chai.request('http://localhost:3300')
            .post('/api/users/register')
            .send({
                username: 'Username2',
                email: 'email2@example.com',
                password: 'NewPassword'
            })
            .end((err, res) => {
                expect(res.status).to.eq(200);
                let response = JSON.parse(res.text);
                expect(response.success).to.be.true;
                done();
            })
    })
})