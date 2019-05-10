import request from 'supertest';
import chai from 'chai';
import faker from 'faker';
import app from '../app';

const { expect } = chai;

let Token;
let adminToken;
let mail;
let loanId;
let userid;


describe('Admin Route', () => {
  it('should verified a user successfully', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(202);
        expect(res.body).to.have.property('data').which.haveOwnProperty('status');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user successfully', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileap@gmail.com/verify')
      .send({ status: 'verified' })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should not verified a user successfully', (done) => {
    request(app)
      .patch('/api/v1/users/kazmobileapp@gmail.com/verify')
      .send({ status: 'verify' })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should get all loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('rowCount');
        done();
      })
      .catch(error => done(error));
  });
  it('should get a specific loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06816')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not get a specific loan application successfully', (done) => {
    request(app)
      .get('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a068r6')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should view current loans (not fully repaid). successfully', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=false')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should view all paid loans successfully', (done) => {
    request(app)
      .get('/api/v1/loans?status=approved&repaid=true')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should approve or reject a loan  successfully', (done) => {
    request(app)
      .patch('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06819')
      .send({ status: 'reject' })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not approve or reject a loan', (done) => {
    request(app)
      .patch('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06819')
      .send({ status: 'rejected' })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should successfully post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06819/repayment')
      .send({ paidAmount: 3000 })
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a16819/repayment')
      .send({ paidAmount: 3000 })
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
});


// tdd admin route version two ( v2)

describe('Admin Route version two (v2)', () => {
  it('should login user successfully and generate admin token', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({ email: 'admin@quickcreditapp.herokuapp.com', password: 'Kazeem27' })
      .end((err, res) => {
        const { body } = res;
        adminToken = body.data[0].token;
        done();
      });
  });
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
        Token = body.token;
        userid = body.data.id;
        done();
      });
  });
  it('should verified a user successfully', (done) => {
    request(app)
      .patch(`/api/v2/users/${mail}/verify`)
      .set('token', adminToken)
      .send({ status: 'verified' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.equal(`users with id:${userid} has been verified`);
        done();
      });
  });
  it('should not verified a user successfully', (done) => {
    request(app)
      .patch('/api/v2/users/kazmobileap@gmail.com/verify')
      .set('token', adminToken)
      .send({ status: 'verified' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(404);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('Not Found');
        done();
      });
  });
  it('should not authorize a user without a tokin', (done) => {
    request(app)
      .patch('/api/v2/users/kazmobileap@gmail.com/verify')
      .send({ status: 'verified' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(403);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('Unauthorized!, you have to login');
        done();
      });
  });
  it('should not authorize a user in admin route', (done) => {
    request(app)
      .patch('/api/v2/users/kazmobileap@gmail.com/verify')
      .set('token', Token)
      .send({ status: 'verified' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(403);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('Unauthorized!, Admin only route');
        done();
      });
  });
  it('should not verified a user successfully with wrong input', (done) => {
    request(app)
      .patch(`/api/v2/users/${mail}/verify`)
      .set('token', adminToken)
      .send({ status: 'verify' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.have.property('error');
        done();
      });
  });
  it('should post a user loan successfully', (done) => {
    request(app)
      .post('/api/v2/loans')
      .set('token', Token)
      .send({ amount: 2000.567, tenor: 2 })
      .end((err, res) => {
        const { body } = res;
        loanId = body.data[0].rows[0].id;
        done();
      });
  });
  it('should get all loan application successfully', (done) => {
    request(app)
      .get('/api/v2/loans')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.equal('loans retrieve successfully');
        done();
      });
  });
  it('should get a specific loan application successfully', (done) => {
    request(app)
      .get(`/api/v2/loans/${loanId}`)
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.equal(`loan with id:${loanId} retrieve successfully`);
        done();
      });
  });
  it('should not get a specific loan application successfully', (done) => {
    request(app)
      .get('/api/v2/loans/aa4a9475-e9fd-4ee0-94ea-dd12f3855d51')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(404);
        expect(body).to.have.property('error');
        done();
      });
  });
  it('should view current loans (not fully repaid). successfully', (done) => {
    request(app)
      .get('/api/v2/loans?status=approved&repaid=false')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body.status).to.be.equal(200);
        expect(body.status).to.be.a('number');
        done();
      });
  });
  it('should view all paid loans successfully', (done) => {
    request(app)
      .get('/api/v2/loans?status=approved&repaid=true')
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(res.status).to.be.equal(200);
        expect(body.status).to.be.equal(200);
        expect(body.status).to.be.a('number');
        done();
      });
  });
  it('should approve or reject a loan  successfully', (done) => {
    request(app)
      .patch(`/api/v2/loans/${loanId}`)
      .set('token', adminToken)
      .send({ status: 'reject' })
      .end((err, res) => {
        const { body } = res;
        const { status } = body.data[0].rows[0];
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.haveOwnProperty('message');
        expect(body.data[0].message).to.be.equal(`loan with id:${loanId} has been ${status}`);
        done();
      });
  });
  it('should not approve or reject a loan without correct input', (done) => {
    request(app)
      .patch(`/api/v2/loans/${loanId}`)
      .set('token', adminToken)
      .send({ status: 'rejected' })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.have.property('error');
        done();
      });
  });
  it('should successfully post loan repayment for a client', (done) => {
    request(app)
      .post(`/api/v2/loans/${loanId}/repayment`)
      .send({ paidAmount: 1000 })
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(201);
        expect(body).to.have.property('data');
        done();
      });
  });
  it('should not post loan repayment for a client if repayment is more than loan', (done) => {
    request(app)
      .post(`/api/v2/loans/${loanId}/repayment`)
      .send({ paidAmount: 4000 })
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(400);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('You can not pay more than your debt!');
        done();
      });
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post(`/api/v2/loans/${loanId}/repayment`)
      .send({ })
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.have.property('error');
        done();
      });
  });
  it('should not post loan repayment for a client', (done) => {
    request(app)
      .post('/api/v2/loans/aa4a9475-e9fd-4ee0-94ea-dd12f3855d51/repayment')
      .send({ paidAmount: 1000 })
      .set('token', adminToken)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(404);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('No such loan found');
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
        done();
      });
  });
});
