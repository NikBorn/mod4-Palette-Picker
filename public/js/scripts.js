const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const generateRandomColors = () => {
  const newPalette = [
    randomColor().toUpperCase(), 
    randomColor().toUpperCase(), 
    randomColor().toUpperCase(), 
    randomColor().toUpperCase(), 
    randomColor().toUpperCase()];
  updateColorText(newPalette);
};

const updateColorText = (newPalette) => {
  $('.color-text-1').text(newPalette[0]);
  $('.color-text-2').text(newPalette[1]);
  $('.color-text-3').text(newPalette[2]);
  $('.color-text-4').text(newPalette[3]);
  $('.color-text-5').text(newPalette[4]);
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



