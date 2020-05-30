// global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialsColors;

//****functions****
//color generator
function generateHex() {
  //** chromaJS cdn**
  const hexColor = chroma.random();
  return hexColor;
}

//add random color to each div => loop through each div
function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();

    //add color to background
    div.style.backgroundColor = randomColor;
    hexText.innerText = randomColor;

    //check for contrast
    checkTextContrast(randomColor, hexText);

    //initial colorize sliders
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    colorizeSliders(color, hue, brightness, saturation);
  });
}

//check color contrast so it adapts to bgd color
function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "rgb(51,51,51)";
  } else {
    text.style.color = "rgb(233,233,233)";
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  //scale saturation using chromajs functions
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  //scale brightness
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  //scale hue

  //update input colors
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0,
  )},${scaleSat(1)}`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0,
  )},${scaleBright(0.5)},${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

randomColors();
