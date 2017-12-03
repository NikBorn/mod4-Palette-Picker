const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const knex = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw (error);
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(err => {
        throw err;
      });
  });
});

describe('API Routes', () => {
  
  before((done) => {
    knex.migrate.latest()
      .then(() => done())
      .catch(error => { throw error; });
  });

  beforeEach((done) => {
    knex.seed.run()
      .then(() => done())
      .catch(error => { throw error; });
  });

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('turing');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
        })
        .catch(err => {
          throw err;
        });
    });

    it('should return a 404 if the path is incorrect', () => {
      chai.request(server)
        .get('/api/v1/bad')
        .end((error, response) => {
          response.should.have.status(404);
        });
    });

  });


  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should return all palettes for a specific project', () => {
      return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[1].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('first palette');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#DF0B24');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#2AD75D');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#516ACD');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#E7DE3C');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#A151C5');
          response.body[0].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
        })
        .catch((error) => {
          throw error;
        });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
        .get('/api/v1/projects/1/hello')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
    });

  });

});