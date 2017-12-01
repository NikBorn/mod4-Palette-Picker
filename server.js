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

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({ error: `No saved Palettes for project ${request.params.id}`})
      }
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

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(projects => {
      if (projects.length) {
        return response.status(200).json(projects);
      } else {
        return response.status(404).json({ error: `could not find project with ID of ${request.params.id}` })
      }
    })
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        return response.status(200).json(palettes);
      } else {
        return response.status(404).json({ error: `could not find palette with ID of ${request.params.id}`})
      }
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  database('palettes').where('id', id).select()
    .then(palettes => {
      if (!palettes.length) {
        return response.status(422).json({
          error: `Could not find palettes with id of ${id}.`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });

  database('palettes').where('id', id).del()
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.patch('/api/v1/projects/:id/palettes/:id', (request, response) => {

});

app.delete('/api/v1/projects/:id', (request, response) => {

})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


