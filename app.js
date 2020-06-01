// global selections and variables
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;
const popup = document.querySelector(".copy-container");

//***add event listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index);
  });
});
currentHexes.forEach((hex) => {
  hex.addEventListener("click", (e) => {
    copyToClipboard(hex);
    console.log(e, hex.value);
  });
});

popup.addEventListener("transitionend", () => {
  const popupBox = popup.children[0];
  console.log(popupBox);
  popup.classList.remove(".active");
  popupBox.classList.remove(".active");
});

//****functions****
//color generator
function generateHex() {
  //** chromaJS cdn**
  const hexColor = chroma.random();
  return hexColor;
}

//add random color to each div => loop through each div
function randomColors() {
  initialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    //add it to the array
    initialColors.push(chroma(randomColor).hex());

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
  //reset inputs
  resetInputs();
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

function hslControls(e) {
  //attach event listener to the right input using attribute
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");

  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  //set color of bgd  to current slider
  const bgColor = initialColors[index];
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;
  //update colors of all the sliders inputs
  colorizeSliders(color, hue, brightness, saturation);
}
//update color text
function updateTextUI(index) {
  const activeDiv = colorDivs[index];
  const color = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.querySelector("h2");
  const icons = activeDiv.querySelectorAll(".controls button");
  textHex.innerText = color.hex();
  //check contrast to update text color according to bgd
  checkTextContrast(color, textHex);
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "sat") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipboard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  console.log(el);

  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  //popup animation
  const popupBox = popup.children[0];

  popup.classList.add(".active");
  popupBox.classList.add(".active");
  console.log(popup);
}
randomColors();
