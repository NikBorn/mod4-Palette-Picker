/*eslint-disable*/

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
          response.body[0].should.have.property('id');
          response.body[1].should.have.property('id');
          response.body[2].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[1].id.should.equal(2);
          response.body[2].id.should.equal(3);
          response.body[0].should.have.property('name');
          response.body[1].should.have.property('name');
          response.body[2].should.have.property('name');
          response.body[0].name.should.equal('first palette');
          response.body[1].name.should.equal('second palette');
          response.body[2].name.should.equal('third palette');
          response.body[0].should.have.property('color1');
          response.body[1].should.have.property('color1');
          response.body[2].should.have.property('color1');
          response.body[0].color1.should.equal('#DF0B24');
          response.body[1].color1.should.equal('#EB40EB');
          response.body[2].color1.should.equal('#83E3FC');
          response.body[0].should.have.property('color2');
          response.body[1].should.have.property('color2');
          response.body[2].should.have.property('color2');
          response.body[0].color2.should.equal('#2AD75D');
          response.body[1].color2.should.equal('#D4E64A');
          response.body[2].color2.should.equal('#C5FCF0');
          response.body[0].should.have.property('color3');
          response.body[1].should.have.property('color3');
          response.body[2].should.have.property('color3');
          response.body[0].color3.should.equal('#516ACD');
          response.body[1].color3.should.equal('#565FCA');
          response.body[2].color3.should.equal('#2F3076');
          response.body[0].should.have.property('color4');
          response.body[1].should.have.property('color4');
          response.body[2].should.have.property('color4');
          response.body[0].color4.should.equal('#E7DE3C');
          response.body[1].color4.should.equal('#149DFF');
          response.body[2].color4.should.equal('#DB81DE');
          response.body[0].should.have.property('color5');
          response.body[1].should.have.property('color5');
          response.body[2].should.have.property('color5');
          response.body[0].color5.should.equal('#A151C5');
          response.body[1].color5.should.equal('#81C6F');
          response.body[2].color5.should.equal('#2B3D64');
          response.body[0].should.have.property('project_id');
          response.body[1].should.have.property('project_id');
          response.body[2].should.have.property('project_id');
          response.body[0].project_id.should.equal(1);
          response.body[1].project_id.should.equal(1);
          response.body[2].project_id.should.equal(1);
          response.body[0].should.have.property('created_at');
          response.body[1].should.have.property('created_at');
          response.body[2].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
          response.body[1].should.have.property('updated_at');
          response.body[2].should.have.property('updated_at');
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

  describe('POST /api/v1/projects', () => {
    it('should be able to add a project to the db', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 4,
          name: 'test-add-project'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
        })
        .catch(error => { throw error; });
    });

    it('should not add the project to database if info is missing', () => {
      return chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 5
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing the name property');
        })
        .catch(error => { throw error; });
    });

  });


  describe('POST /api/v1/projects/:id/palettes', () => {
    it('should be able to add a palette to the database', () => {
      return chai.request(server)
        .post('/api/v1/projects/3/palettes')
        .send({
          id: 7,
          name: 'test-palette',
          color1: '#3130E8',
          color2: '#FBE316',
          color3: '#22CA2E',
          color4: '#6CA2D1',
          color5: '#BD050F',
          project_id: 3
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(7);
        })
        .catch(error => { throw error; });
    });

    it('should not add a palette to database if it is missing information', () => {
      return chai.request(server)
        .post('/api/v1/projects/1/palettes')
        .send({
          id: 8,
          name: 'bad-test-palette',
          color1: '#CF3453',
          color2: '#F07FE',
          color3: '#326598',
          color4: '#EA618E',
       
          project_Id: 3
        })
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('You are missing the color5 property');
        })
        .catch(error => { throw error; });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    it('should be able to delete a certain palette', () => {
      return chai.request(server)
        .del('/api/v1/palettes/1')
        .then(response => {
          response.should.have.status(204);
        })
        .catch(error => { throw error; });
    });

    it('should return 422 if palette does not exist', () => {
      return chai.request(server)
        .del('/api/v1/palettes/55')
        .then(response => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find palettes with id of 55.');
        })
        .catch(error => { throw error; });
    });


  });

});