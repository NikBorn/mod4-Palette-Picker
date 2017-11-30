const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get('/', (request, response) => {
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      return response.status(200).json(projects);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      return response.status(200).json(palettes);
    })
    .catch((error) => {
      return response.status(500).json({ error })
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const projectId = request.params.id;

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You re missing the ${requiredParameter} property`
      });
    }
  }

  palette = Object.assign({}, palette, { project_id: projectId })

  database('palettes').insert(palette, 'id')
    .then(palette => {
      return response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      return response.status(500).json({ error })
    })

});








app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

