import request from 'supertest';
import chai from 'chai';
import app from '../app';

const { expect } = chai;

let token1;
let token2;
let token3;

describe('Loan Route', () => {
  it('should post a user loan successfully', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({ amount: 2000.567, tenor: 3 })
      .then((res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a user loan successfully', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({ amount: 2000.567, tenor: 13 })
      .then((res) => {
        expect(res.status).to.be.equal(422);
        expect(res.body).to.have.property('error');
        done();
      })
      .catch(error => done(error));
  });
  it('should not post a user loan successfully', (done) => {
    request(app)
      .post('/api/v1/loans')
      .send({ amount: 2000.567, tenor: 3 })
      .then((res) => {
        expect(res.status).to.be.equal(402);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
  it('should retrieve a loan repayment history successfully', (done) => {
    request(app)
      .get('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06819/repayment')
      .then((res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('data');
        done();
      })
      .catch(error => done(error));
  });
  it('should not retrieve a loan repayment history', (done) => {
    request(app)
      .get('/api/v1/loans/3e66de26-5bbb-430b-9458-f35fc2a06839/repayment')
      .then((res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      })
      .catch(error => done(error));
  });
});


// test version two (v2) enpoints

describe('Loan Route version two (v2)', () => {
  it('should signin user and generate token1', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'admin@quickcreditapp.herokuapp.com',
        password: 'Kazeem27',
      })
      .end((err, res) => {
        const { body } = res;
        token1 = body.data[0].token;
        done();
      });
  });
  it('should signin user and generate token2', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'tobi4real2050@gmail.com',
        password: 'Kazeem27',
      })
      .end((err, res) => {
        const { body } = res;
        token2 = body.data[0].token;
        done();
      });
  });
  it('should signin user and generate token3', (done) => {
    request(app)
      .post('/api/v2/auth/signin')
      .send({
        email: 'kaztech2016@gmail.com',
        password: 'Kazeem27',
      })
      .end((err, res) => {
        const { body } = res;
        token3 = body.data[0].token;
        done();
      });
  });
  it('should not post a user loan successfully, tenor should be between 1 - 12', (done) => {
    request(app)
      .post('/api/v2/loans')
      .set('token', token2)
      .send({ amount: 2000.567, tenor: 13 })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.have.property('error');
        done();
      });
  });
  it('should not post a user loan if user status is pending or unverified', (done) => {
    request(app)
      .post('/api/v2/loans')
      .set('token', token3)
      .send({ amount: 2000.567, tenor: 3 })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(422);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('wait for verification and re-apply');
        done();
      });
  });
  it('should not post a user loan successfully if user have a pending loan', (done) => {
    request(app)
      .post('/api/v2/loans')
      .set('token', token1)
      .send({ amount: 2000.567, tenor: 3 })
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(402);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('you have an outstanding loan');
        done();
      });
  });
  it('should retrieve a loan repayment history successfully', (done) => {
    request(app)
      .get('/api/v2/loans/aa4a9475-e9fd-4ee0-94ea-dd12f3855d50/repayment')
      .set('token', token1)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(200);
        expect(body).to.have.property('data');
        expect(body.data[0]).to.have.property('message');
        expect(body.data[0]).to.have.property('repaid');
        expect(body.data[0].message).to.be.equal('loan with id:aa4a9475-e9fd-4ee0-94ea-dd12f3855d50 retrieve successfully');
        done();
      });
  });
  it('should not retrieve a loan repayment history', (done) => {
    request(app)
      .get('/api/v2/loans/3e66de26-5bbb-430b-9458-f35fc2a06839/repayment')
      .set('token', token1)
      .end((err, res) => {
        const { body } = res;
        expect(body.status).to.be.equal(404);
        expect(body).to.have.property('error');
        expect(body.error).to.be.equal('Not Found');
        done();
      });
  });
});
