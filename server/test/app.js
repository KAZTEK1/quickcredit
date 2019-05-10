import request from 'supertest';
import chai from 'chai';
import assert from 'assert';
import http from 'http';
import app from '../app';

const { expect } = chai;

describe('APP js', () => {
  it('should get home successfully', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });
  it('Should return a welcome message', (done) => {
    request(app)
      .get('/api/v1/invalid')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.be.a('number');
        expect(res.status).to.be.equal(404);
        expect(res.body.status).to.be.equal(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.be.equal('Wrong request. Route does not exist');
        done();
      });
  });
});

describe('HTTP Server', () => {
  it('should return 200', (done) => {
    http.get('http://localhost:5500', (res) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
});
