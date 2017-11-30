let projectsArray = [];
let colorPalette = [];


const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const generateRandomColors = () => {
  colorPalette = [];
  let count = 0;
  console.log('count', count)
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

$('.save-palette-button').on('click', () => {
  const paletteName = $('.palette-name-input').val();
  console.log(paletteName);
});

$('.save-project-button').on('click', () => {
  const projectName = $('.project-name-input').val();
  console.log(projectName);
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
                          console.log(projectsArray)})
      // return Object.assign({}, project, palettes)
    })
  })
}


generateRandomColors();
fetchAllProjects();