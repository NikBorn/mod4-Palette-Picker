let projectsArray = [];
let colorPalette = [];
/*eslint-disable*/


let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, name',
  palettes:
    'id, color1, color2, color3, color4, color5, name, project_Id',
});




const postOfflineProjects = function (projects) {
  return db.projects.add({ id: Date.now(), projects });
};

const postOfflinePalettes = function (palettes) {
  return db.palettes.add({ id: Date.now(), palettes });
};

const fetchOfflineProjects = function () {
  return db.projects.toArray();
};

const fetchOfflinePalettes = function () {
  return db.palettes.toArray();
};

navigator.serviceWorker.addEventListener('message', event => {
  if (event.data.type === 'project') {
    setPendingProjectsToSynced()
      .then(result => {
        console.log('send setPendingProjectsToSynced log', result);
      })
      .catch(error => console.error(error));
  } else if (event.data.type === 'palette') {
    setPendingPalettesToSynced()
      .then(() => {
      })
      .catch(error => console.error(error));
  }
});

const setPendingProjectsToSynced = function () {
  return db.projects.where('status')
    .equals('pendingSync')
    .modify({ status: 'synced' });
};

const setPendingPalettesToSynced = function () {
  return db.palettes.where('status')
    .equals('pendingSync')
    .modify({ status: 'synced' });
};

const sendProjectToSync = function (project) {
  navigator.serviceWorker.controller.postMessage({
    type: 'projects',
    project
  });
};

const sendPaletteToSync = function (palette) {
  navigator.serviceWorker.controller.postMessage({
    type: 'palettes',
    palette
  });
};

const retreiveOfflineProjects = function () {
  fetchOfflineProjects()
    .then(projects => {
      updateDropDown(projects)
      prependProjects(projects)})
    .catch(error => {
      throw error;
    });
};

const retreiveOfflinePalettes = function (projectId) {
  fetchOfflinePalettes()
    .then(palettes => {
      palettes.forEach(palette => {
        htmlPalettes(palette, projectId)
      })
    })
    .catch(error => {
      throw error;
    });
};

const generateOfflineProjects = function (name) {
  postOfflineProjects({ id: Date.now(), name })
    .then(() => {
      updateDropDown([{name}])
      console.log('IndexedDC store - success!')})
    .catch(error => console.error('Error storing locally: ', error));
};

const generateOfflinePalettes = function (body) {
  postOfflinePalettes({ id: Date.now(), body })
    .then(() => console.log('success storing palettes'))
    .catch(error => console.error('Error storing palettes locally: ', error));
};




const randomColor = function () {
  let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return checkColor(color);
};

const checkColor = function (color) {
  if (color.length === 7) {
    return color;
  } else {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return checkColor(color);
  }
};

const generateRandomColors = function () {
  if (!colorPalette.length) {
    createColorArray();
  } else {
    colorPalette = colorPalette.map((color, index) => {
      if (color.isLocked === false) {
        color = { 
          color: randomColor().toUpperCase(), 
          isLocked: false, paletteIndex: index };
      }
      return color;
    });
  }
  updateColorDisplay(colorPalette);
};

const createColorArray = function () {
  let count = 0;
  while (count < 5) {
    colorPalette.push({ 
      color: randomColor().toUpperCase(), 
      isLocked: false, 
      paletteIndex: count });
    count++;
  }
};

const fetchAllProjects = function () {
  return fetch(`/api/v1/projects`)
    .then(results => results.json())
    .then(projects => {
      projects.map(project => {
        fetch(`/api/v1/projects/${project.id}/palettes`)
          .then(resultz => resultz.json())
          .then(res => project.palettes = res)
          .then(() => {
            projectsArray.push(project);
            prependProjects(projectsArray);
            updateDropDown(projectsArray);
          })
          .catch(() => retreiveOfflinePalettes(projectId));
      });
    })
    .catch(() => retreiveOfflineProjects())
};

const toggleLockClass = function (color, lock) {
  return lock.toggleClass('locked');
};

const updateColorDisplay = function (newPalette) {
  newPalette.forEach((color, index) => {
    $(`.color-text-${index + 1}`).text(newPalette[index].color);
    $(`.color${index + 1}`).css('backgroundColor', newPalette[index].color);
  });
};

const htmlMiniSquare = function (paletteColor, index) {
  const color = paletteColor.substr(1);
  return (
    `<div id='${color}' class='colorbox-mini mini-${index}'>
      <h6>${paletteColor}</h6>
    </div>`
  );
};

const htmlPalettes = function (palette, projectId) {
  const project = $(`.project-container${projectId}`);
  project.append(
    `<div class='palette-card'>
      <h5 class='palette-name'>${palette.name}</h5>
      <div class='delete-palette-button' 
           projectID='${projectId}' 
           paletteID='${palette.id}'></div>
      <div class='mini-palette'>
        ${htmlMiniSquare(palette.color1, 1)}
        ${htmlMiniSquare(palette.color2, 2)}
        ${htmlMiniSquare(palette.color3, 3)}
        ${htmlMiniSquare(palette.color4, 4)}
        ${htmlMiniSquare(palette.color5, 5)}
      </div>
    </div>`

  );
  updateMiniColors(palette);
};

const prependProjects = function (projectsArray) {
  const projectsContainer = $('.projects-container');
  projectsContainer.empty();
  projectsArray.forEach(project => {
    addProject(project);
    let palettes = project.palettes;
    if (palettes.length) {
      palettes.map(palette => {
        htmlPalettes(palette, project.id);
      });
    }
  });
};

const addProject = function (project) {
  const projectsContainer = $('.projects-container');
  projectsContainer.append(
    `<div class='project-container${project.id}' >
      <h4 class='project-name'>${project.name.toUpperCase()}</h4>
      </div>`
  );
};

const updateMiniColors = function (palette) {
  const paletteKeys = Object.keys(palette);
  const keys = Object.keys(palette).sort().splice(0, 5);
  keys.forEach(function (color) {
    let colorId = (palette[color].substr(1));
    $(`#${colorId}`).css('backgroundColor', `${palette[color]}`);
  });
};

const updateDropDown = function (projectsArray) {
  const projectsDropDown = $('.projects-dropdown');
  $('.projects-dropdown').html('');
  projectsArray.forEach((project) => {
    projectsDropDown.append(
      `<option value="${project.id}">${project.name.toUpperCase()}</option>`
    );
  });
};

// const add

const addPaletteToDB = function (newPalette) {
  return fetch(`/api/v1/projects/${newPalette.project_id}/palettes`, {
    method: 'post',
    body: JSON.stringify(newPalette),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(() => {
      htmlPalettes(newPalette, newPalette.project_id);
      generateOfflinePalettes(newPalette);
    });
};

const deletePaletteFromDB = function (id) {
  fetch(`./api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
    .then(response => console.log(response))
    .catch(res => console.log(res));
};

const toggleLock = function (index) {
  const colorToToggle = colorPalette[index];
  if (colorToToggle.isLocked) {
    colorToToggle.isLocked = false;
  } else {
    colorToToggle.isLocked = true;
  }
  const lock = $(`.color${index + 1}`).children('div');
  toggleLockClass(colorToToggle, lock);
};

$('.projects-container').on('click', '.delete-palette-button', function () {
  const paletteId = $(this).attr('paletteID');
  $(this).parent().remove();
  deletePaletteFromDB(paletteId);
});

$('.save-palette-button').on('click', () => {
  const newPalette = Object.assign({
    name: $('.palette-name-input').val(),
    color1: $('.color-text-1').text(),
    color2: $('.color-text-2').text(),
    color3: $('.color-text-3').text(),
    color4: $('.color-text-4').text(),
    color5: $('.color-text-5').text(),
    project_id: $('.projects-dropdown').val()
  });
  addPaletteToDB(newPalette);
});

$('.save-project-button').on('click', () => {
  const name = $('.project-name-input').val();
  fetch('./api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({
      name
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(res => {
      const project = Object.assign({ name }, res);
      addProject(project);
      generateOfflineProjects(name);
    });
});

$('.generate-palette-button').on('click', () => {
  generateRandomColors();
});

$('.colorbox').on('click', function () {
  const colorText = $(this)[0];
  const colorArrayIndex = $(colorText).attr('class').split(' ')[0].slice(5);
  toggleLock(colorArrayIndex - 1);
});

$('.projects-container').on('click', '.colorbox-mini', function () {
  let cardColors = $(this).parent().children();
  let colorsArray = Array.from(cardColors).map((color, index) => 
    Object.assign({}, colorPalette[index], { color: '#' + color.id}));
  colorPalette = colorsArray;  
  updateColorDisplay(colorPalette);
});

generateRandomColors();
fetchAllProjects();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => {
        console.log('serviceWorker registartion successful');
      })
      .catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });
  });//end eventListener
}