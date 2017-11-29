
const generateRandomColors = () => {
  console.log('make colors!')
}

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
})



