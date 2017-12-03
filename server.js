const express = require('express'); //importing express
const app = express(); //creating an instance of express
const bodyParser = require('body-parser'); //importing bodyParser

app.set('port', process.env.PORT || 3000); //setting the port number

app.use(bodyParser.json());  //telling app to use bodyParser when going through a json file.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public')); //telling the db to deliver my static files from my public folder

const environment = process.env.NODE_ENV || 'development'; //setting the envorinment
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);//configuring that database with knex

app.get('/', (request, response) => {//declaring the root endpoint
});//app is returning my static files from line 11;

app.get('/api/v1/projects', (request, response) => {//telling the server to listen for get requests for all projects
  database('projects').select() //searching the databse for the projects table and selecting it.
    .then((projects) => {
      return response.status(200).json(projects);//telling the db to return a status of 200 along with the projects from the db.
    })
    .catch((error) => {
      return response.status(500).json({ error });//if there is an error return a status of 500 along with the error.
    });
});

app.get('/api/v1/palettes', (request, response) => {//telling the server to listen for get requests at this url for all palettes
  database('palettes').select()//searching the database for the palettes table.
    .then((palettes) => {
      return response.status(200).json(palettes);//return all palettes from the table along with a status of 200
    })
    .catch((error) => {
      return response.status(500).json({ error })//if an error return status 500 along with the error message
    });
});

app.post('/api/v1/projects', (request, response) => {//telling the server to listen for post requests made to this url for a new project
  const project = request.body; //grabbing the project info from the request

  for (let requiredParameter of ['name']) {// verifying that all rhe requiredParameters are met
    if (!project[requiredParameter]) {//checking if a param is missing
      return response.status(422).json({//if user is missing the name parameter it will send a status of 422 and an error.
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('projects').insert(project, 'id')//inserting the project into the projects table along with an id being provided by the db.
    .then(project => {
      return response.status(201).json({ id: project[0] })//sending a response of 201 along with the project id if successful.
    })
    .catch(error => {
      return response.status(500).json({ error })//sending a response of 500 and the error if unsuccessful
    })
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {//telling the server to listen to get requests for a palette belonging to a certain project
  database('palettes').where('project_id', request.params.id).select()//searching the palettes db for any palettes that belong to the project based on project_id.
    .then(palettes => {
      if (palettes.length) {//verifying that palettes do exist for this project
        return response.status(200).json(palettes);//returning a status of 200 along with an array of palettes belonging to a certian project.
      } else {
        return response.status(404).json({ error: `No saved Palettes for project ${request.params.id}`})//alert user that there are no palettes for that project.
      }
    })
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {//telling the app to listen for post requests made to this url for a palette belonging to a certain project
  let palette = request.body; //grabbing paltte from the request
  const projectId = request.params.id; //grabbing the project id from the request

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {//verifying all the requiredParams are provided
    if (!palette[requiredParameter]) { //if they are not do what is to follow!
      return response.status(422).json({ // if all params asr not met sending a status of 422 with the first property missing
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  palette = Object.assign({}, palette, { project_id: projectId }) //reasigning the palette to the entire palette, inserting the project_id to the palette

  database('palettes').insert(palette, 'id') //inserting the palette into the table along with an id provided by the db
    .then(palette => {
      return response.status(201).json({ id: palette[0] })//returning a status of 201 along iwth the id
    })
    .catch(error => {
      return response.status(500).json({ error }) //returning a response of 500 and the error if one occurs
    })
});

app.get('/api/v1/projects/:id', (request, response) => {//telling the server to listen for get requests made for a certain project
  database('projects').where('id', request.params.id).select() //searching the databse for a table called projects  and a project with an id of params.id
    .then(projects => {
      if (projects.length) { //verifying the project exists
        return response.status(200).json(projects);//returning a status of 200 along with the project
      } else {
        return response.status(404).json({ error: `could not find project with ID of ${request.params.id}` })//returning a status of 404 along with an error telling the user the project doesn't exist
      }
    })
});

app.get('/api/v1/palettes/:id', (request, response) => {//telling the server to liten for get requests for a certain palette
  database('palettes').where('id', request.params.id).select()//searching the databse for a table called palettes  and a palette with an id of params.id
    .then(palettes => {
      if (palettes.length) { //verifying the palette exists
        return response.status(200).json(palettes);//returning a status of 200 along with the palette
      } else {
        return response.status(404).json({ error: `could not find palette with ID of ${request.params.id}` })//returning a status of 404 along with an error telling the user the palette doesn't exist
      }
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => {//telling the server to listin for delete methods called on this url
  const { id } = request.params; //grabbing the id of the palette fromthe request
  database('palettes').where('id', id).select()//searching the palettes table for a palette with a matching id
    .then(palettes => {
      if (!palettes.length) {//verifying a palette does exist
        return response.status(422).json({
          error: `Could not find palettes with id of ${id}.`//returning a status of 422 along with a message telling the user the palette doesn't exist
        });
      }
      database('palettes').where('id', id).del()//removing the palette from the db.
        .then(() => {
          return response.sendStatus(204);//returning a success status of 204
        })    
    })
    .catch(error => {
      return response.status(500).json({ error });//returning a 500 status along with the error
    });
});

app.listen(app.get('port'), () => {//telling the app to listen on the port we assigned for any of the endpoints and methods
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);//console logging the app name and which port it is running on.
});

module.exports = app;
