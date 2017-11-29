const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

const generateRandomColors = () => {
  const newPalette = [randomColor(), randomColor(), randomColor(), randomColor(), randomColor()]
  console.log(newPalette)
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



