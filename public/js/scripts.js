let projectsArray = [];
let colorPalette = [];


const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const generateRandomColors = () => {
  colorPalette = [];
  let count = 0;
  while(count < 6) {
    colorPalette.push({ color: randomColor().toUpperCase(), isLocked: false })
    count++
  };
  if (count = 6) {
    count = 0;
  };
  updateColorDisplay(colorPalette);
};

const updateColorDisplay = newPalette => {
  newPalette.forEach((color, index) => {
    $(`.color-text-${index + 1}`).text(newPalette[index].color);
    $(`.color${index + 1}`).css('backgroundColor', newPalette[index].color);
  })
};

const htmlPalettes = (palette, project) => {
  return (
    `<div class='mini-palette'>
          <div id='i${palette.color1}'  class='colorbox-mini mini-1'>
              <h6>${palette.color1}</h6>
            </div>
            <div id='i${palette.color2}'  class='colorbox-mini mini-2'>
              <h6>${palette.color2}</h6>
            </div>
            <div id='i${palette.color3}'  class='colorbox-mini mini-3'>
              <h6>${palette.color3}</h6>
            </div>
            <div id='i${palette.color4}'  class='colorbox-mini mini-4'>
              <h6>${palette.color4}</h6>
            </div>
            <div id='i${palette.color5}'  class='colorbox-mini mini-5'>
              <h6>${palette.color5}</h6>
            </div>
          </div>`
  )
}

const prependProjects = (projectsArray) => {
  const projectsContainer = $('.projects-container');
  projectsContainer.html('');

  projectsArray.forEach(project => {
    palettes = project.palettes 
    const palettesHTML = palettes.map(palette => {
      return htmlPalettes(palette, project)
    })
    projectsContainer.prepend(
      `<div class='project-container'>
        <h5>${project.name}</h5>
        
          ${palettesHTML}
       
      </div>`
    )
  })
}

const updateMiniColors = () => {
  const boxes = $('.colorbox-mini');
  const boxesArray = Array.from(boxes)
  console.log('boxes: ', boxesArray)
  boxesArray.forEach(box => {
    // console.log(box.id.slice(1))
    const IDIOT = box.id
    const boxxx = $(IDIOT)//.css('backgroundColor', box.id.slice(1))
    console.log(boxxx)
  })
}

$('.save-palette-button').on('click', () => {
  const paletteName = $('.palette-name-input').val();
});

$('.save-project-button').on('click', () => {
  const projectName = $('.project-name-input').val();
  updateMiniColors();
});

$('.generate-palette-button').on('click', () => {
  generateRandomColors();
});

const fetchAllProjects = () => {
  return fetch(`http://localhost:3000/api/v1/projects`)
    .then(results => results.json())
    .then(projects => {
      projects.map(project=> {
      fetch(`http://localhost:3000/api/v1/projects/${project.id}/palettes`)
                        .then(resultz => resultz.json())
                        .then(res => project.palettes = res)
                        .then(completeProject => {
                          projectsArray.push(project)
                          prependProjects(projectsArray)
                        })    
    })
  })
}

generateRandomColors();
fetchAllProjects();