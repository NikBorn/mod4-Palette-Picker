const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [{
    id: '1',
    name: 'first palette',
    color1: '',
    color2: '',
    color3: '',
    color4: '',
    color5: ''
  },
  {
    id: '2',
      name: 'second palette',
      color1: '',
      color2: '',
      color3: '',
      color4: '',
      color5: ''
  }
];

app.get('/', (request, response) => {
});

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;

  response.json({
    projects
  });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const {
    id
  } = request.params;
  const project = app.locals.projects.find(project => project.id === id);
  if (project) {
    return response.status(200).json(project);
  } else {
    return response.sendStatus(404);
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.post('/api/v1/projects', (request, response) => {
  const {
    project
  } = request.body;
  const id = Date.now();

  if (!project) {
    return response.status(422).send({
      error: 'No project added!'
    });
  } else {
    app.locals.projects.push({
      id,
      project
    });
    return response.status(201).json({
      id,
      project
    });
  }
})