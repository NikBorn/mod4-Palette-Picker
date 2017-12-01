let projectsArray = [];
let colorPalette = [];

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const generateRandomColors = () => {
  colorPalette = [];
  let count = 0;
  while (count < 6) {
    colorPalette.push({ color: randomColor().toUpperCase(), isLocked: false });
    count++;
  }
  if (count === 6) {
    count = 0;
  }
  updateColorDisplay(colorPalette);
};

const updateColorDisplay = newPalette => {
  newPalette.forEach((color, index) => {
    $(`.color-text-${index + 1}`).text(newPalette[index].color);
    $(`.color${index + 1}`).css('backgroundColor', newPalette[index].color);
  });
};

const htmlMiniSquare = (paletteColor, index) => {
  return (
    `    <div id='i${paletteColor}' class='colorbox-mini mini-${index}'>
      <h6>${paletteColor}</h6>
    </div>`
  );
};

const htmlPalettes = (palette, projectId) => {
  const project = $(`.project-container${projectId}`);
  project.append(
    `<div class='palette-card'>
      <h5 class='palette-name'>${palette.name}</h5>
      <div class='delete-palette-button' projectID='${projectId}' paletteID='${palette.id}'></div>
      <div class='mini-palette'>
        ${htmlMiniSquare(palette.color1, 1)}
        ${htmlMiniSquare(palette.color2, 2)}
        ${htmlMiniSquare(palette.color3, 3)}
        ${htmlMiniSquare(palette.color4, 4)}
        ${htmlMiniSquare(palette.color5, 5)}
      </div>
    </div>`

  )
  updateMiniColors(palette)
}

const prependProjects = (projectsArray) => {
  const projectsContainer = $('.projects-container');
  projectsContainer.empty();
  // console.log(projectsContainer);
  projectsArray.forEach(project => {
    projectsContainer.append(
      `<div class='project-container${project.id}' >
      <h4>${project.name.toUpperCase()}</h4>
      </div>`
    );
    let palettes = project.palettes;
    if (palettes.length) {
      palettes.map(palette => {
        htmlPalettes(palette, project.id);
      });
    }
    // ${palettesHTML}
  });
};


const updateMiniColors = (palette) => {
  const keys = Object.keys(palette).splice(2, 5)
  keys.forEach(color => {
    $(`.colorbox-mini, i${palette[color]}`).css('backgroundColor', `${palette[color]}`)
   
  })
  // palette.forEach(color=> {
    
  // })
  // const boxesArray = Array.from(boxes)
  // console.log('boxes: ', boxesArray)
  // boxesArray.forEach(box => {
  //   // console.log(box.id.slice(1))
  //   const IDIOT = box.id
  //   const boxxx = $(IDIOT)//.css('backgroundColor', box.id.slice(1))
  //   console.log(boxxx)
  // })
}

const updateDropDown = (projectsArray) => {
  const projectsDropDown = $('.projects-dropdown');
  $('.projects-dropdown').html('');
  projectsArray.forEach((project) => {
    projectsDropDown.append(
      `<option value="${project.id}">${project.name.toUpperCase()}</option>`
    );
  });
};

const addPaletteToDB = (newPalette) => {
  // console.log(newPalette);
  return fetch(`/api/v1/projects/${newPalette.project_id}/palettes`, {
    method: 'post',
    body: JSON.stringify(newPalette),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(() => {
      // prependNewPalette(newPalette)
      htmlPalettes(newPalette, newPalette.project_id);
      // console.log(parsedResponse)
    });
};

const deletePaletteFromDB = (id) => {
  fetch(`./api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
    .then(response => console.log(response))
    .catch(res => console.log(res));
};

$('.projects-container').on('click', '.delete-palette-button', function () {
  const paletteId = $(this).attr('paletteID');
  // const paletteCard = $(this).parent().remove()
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
    .then(res => console.log(res));
});

$('.generate-palette-button').on('click', () => {
  generateRandomColors();
});

const fetchAllProjects = () => {
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
          });
      });
    });
};

generateRandomColors();
fetchAllProjects();
