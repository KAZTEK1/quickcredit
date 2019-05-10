/* eslint-disable import/no-mutable-exports */
import chai from 'chai';
import request from 'supertest';
import faker from 'faker';
import app from '../app';

const { expect } = chai;

let Token;
let adminToken;
let mail;
let userid;

// test version one (v1) endpoints

describe('User Route', () => {
  it('should successfully signup a user with valid details', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'testingapp@gmail.com',
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with invalid details', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'testingapp',
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  it('should not signup a user with already exist email', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'testingapp@gmail.com',
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .then((res) => {
        expect(res.status).to.be.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(err => done(err));
  });
  it('should login user successfully', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kazmobileapp@gmail.com', password: 'Kazeem27' })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('token');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with invalid data', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kazmobileapp@gmail.com', password: 'razeem27' })
      .then((res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with non-exist details, it should return 404', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kazmobileap@gmail.com', password: 'razeem27' })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not login user with incomplete details', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'kazmobileapp@gmail.com' })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all users successfully', (done) => {
    request(app)
      .get('/api/v1/auth/user')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('rowCount');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a user successfully', (done) => {
    request(app)
      .get('/api/v1/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef67d')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a user with invalid id', (done) => {
    request(app)
      .get('/api/v1/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef37d')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should patch a user successfully', (done) => {
    request(app)
      .patch('/api/v1/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef67d')
      .send({
        firstName: 'tester',
        lastName: 'testing',
        address: '27, tunji Olaiya street',
      })
      .then((res) => {
        expect(res.status).to.be.equal(202);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not patch a user successfully', (done) => {
    request(app)
      .patch('/api/v1/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef67d')
      .send({
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should delete a user successfully', (done) => {
    request(app)
      .delete('/api/v1/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef67d')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should not delete a user if id does not exist', (done) => {
    request(app)
      .delete('/api/v1/auth/user/900d6eea-r900-4e9d-9bd9-029a838ef67d')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
});

// test version two (v2) enpoints

describe('User Route version two (v2)', () => {
  it('should successfully signup a user with valid details', (done) => {
    request(app)
      .post('/api/v2/auth/signup')
      .send({
        email: faker.internet.email(),
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .end((err, res) => {
        const { body } = res;
        mail = body.data.email;
        userid = body.data.id;
        expect(body.status).to.be.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.have.property('data');
        expect(body).to.have.property('token');
        expect(res.status).to.a('number');
        expect(res.status).to.be.equal(201);
        done();
      });
  });
  it('should not signup a user with invalid details', (done) => {
    request(app)
      .post('/api/v2/auth/signup')
      .send({
        email: 'testingapp',
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.be.an('object');
        expect(body).to.have.property('status');
        expect(body).to.haveOwnProperty('error');
        done();
      });
  });
  it('should not signup a user with already exist email', (done) => {
    request(app)
      .post('/api/v2/auth/signup')
      .send({
        email: 'admin@quickcreditapp.herokuapp.com',
        firstName: 'tester',
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(409);
        expect(body).to.be.an('object');
        expect(body.status).to.be.equal(409);
        expect(body).to.have.property('status');
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.a('string');
        expect(body.error).to.equals('User already exist');
        done();
      });
  });
  it('should login user successfully and generate admin token', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({ email: 'admin@quickcreditapp.herokuapp.com', password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        adminToken = body.data[0].token;
        expect(res.status).to.be.equal(200);
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0]).to.haveOwnProperty('user');
        expect(body.data[0].user).to.be.an('object');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
  it('should login user succesfully and generate user token', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({ email: mail, password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        Token = body.data[0].token;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('token');
        expect(body.data[0]).to.haveOwnProperty('user');
        expect(body.data[0].user).to.be.an('object');
        expect(body.data[0].token).to.be.a('string');
        done();
      });
  });
  it('should not login user with non-exist details, it should return 404', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({ email: 'kazmobileap@mail.com', password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(404);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal('User not Found');
        done();
      });
  });
  it('Should return an error if login inputs are empty', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({ })
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(422);
        expect(body).to.haveOwnProperty('error');
        done();
      });
  });
  it('Should return an error if login password is not correct', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'admin@quickcreditapp.herokuapp.com',
        password: '1940andel',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(401);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal('Email/Password incorrect');
        done();
      });
  });
  it('should get all users successfully', (done) => {
    request(app)
      .get('/api/v2/auth/user')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('data');
        done();
      });
  });
  it('should get a user successfully', (done) => {
    request(app)
      .get(`/api/v2/auth/user/${userid}`)
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(200);
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('data');
        done();
      });
  });
  it('should not get a user with invalid id', (done) => {
    request(app)
      .get('/api/v2/auth/user/900d6eea-d900-4e9d-9bd9-029a838ef37d')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(404);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.be.equal('Not Found');
        done();
      });
  });
  it('should patch a user successfully', (done) => {
    request(app)
      .patch(`/api/v2/auth/user/${userid}`)
      .set('token', Token)
      .send({
        firstName: 'testername',
        lastName: 'testing',
        address: '27, tunji Olaiya street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(202);
        expect(body.status).to.be.equal(202);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.have.property('message');
        expect(body.data[0].message).to.be.equal(`users with id:${userid} has been updated`);
        done();
      });
  });
  it('should not patch a user successfully with incomplete details', (done) => {
    request(app)
      .patch(`/api/v2/auth/user/${userid}`)
      .set('token', Token)
      .send({
        lastName: 'testing',
        password: 'Kazeem27',
        address: '27, tunji Olaiya street',
      })
      .end((err, res) => {
        const { body } = res;
        expect(body).to.be.an('object');
        expect(body.status).to.be.a('number');
        expect(body.status).to.be.equals(422);
        expect(body).to.haveOwnProperty('error');
        done();
      });
  });
  it('should delete a user successfully', (done) => {
    request(app)
      .delete(`/api/v2/auth/user/${userid}`)
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.have.property('message');
        expect(body.data[0].message).to.be.equal(`users with id:${userid} has been deleted`);
        done();
      });
  });
  it('should not delete a user if id does not exist', (done) => {
    request(app)
      .delete(`/api/v2/auth/user/${userid}`)
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(404);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('Not Found');
        done();
      });
  });
});
