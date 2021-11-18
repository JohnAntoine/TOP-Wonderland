const body = document.querySelector('body');
const barf = document.querySelector('button');

let currentColor = {
  hue: 0,
  saturation: 0,
  lightness: 0
};


// const shadeCell = (e, shading) => {
//   e.target.classList.remove('colored', 'rainbow');
//   e.target.classList.add(`${shading}`);
// };


const shadeCell = (e) => {
  e.target.style.backgroundColor = hslToString(currentColor);
  // const color = window.getComputedStyle(e.target).getPropertyValue('background-color');
  // console.log(this);
};


const createGrid = count => {
  const sketchContainer = document.createElement('div');
  sketchContainer.classList.add('sketch', 'container');

  for (let i = 0; i < count * count; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sketch', 'cell');
    cell.style.width = `calc(100% / ${count})`;
    cell.style.height = `calc(100% / ${count})`;
    // cell.addEventListener('mouseenter', (e) => {
    //   shadeCell(e,  'colored');
    // });
    cell.addEventListener('mouseenter', shadeCell);
    sketchContainer.appendChild(cell);
  }

  return sketchContainer;
};


// barf.addEventListener('click', () => {
//   const grid = document.querySelectorAll('.cell');
//   grid.forEach(cell => {
//     cell.removeEventListener('mouseenter', (e) => {
//       shadeCell(e,  'colored');
//     });
//     cell.addEventListener('mouseenter', (e) => {
//       shadeCell(e,  'rainbow');
//     });
//   });
// });


function activateSolidColor(e) {

}


function activateRainbow(e) {

}


function activateShading(e) {

}


// Helper Functions

function parseRGB(rgb) {
  let parsed = rgb.split('(')[1];
  parsed = (parsed.search(',') >= 0) ? parsed.split(',') : parsed.split(' ');
  if (parsed.length > 3) parsed.pop();
  else parsed[2] = parsed[2].split(')')[0];
  const values = {
    red: parseFloat(parsed[0]),
    green: parseFloat(parsed[1]),
    blue: parseFloat(parsed[2]),
  }
  return values;
}

function rgbToHsl(v) {
  let max, min, h, s, l;
  r = v.red / 255;
  g = v.green / 255;
  b = v.blue / 255;

  if ((r === g) && (r == b)) {
    max = r;
    min = r;
    h = 0;
  } else if ((r >= g) && (r >= b)) {
    max = r;
    min = (g <= b) ? g : b;
    h = 60 * ((g - b)/(max - min));
  } else if ((g >= r) && (g >= b)) {
    max = g;
    min = (r <= b) ? r : b;
    h = 60 * ( 2 + ((b - r)/(max - min)));
  } else {
    max = b;
    min = (r <= g) ? r : g;
    h = 60 * ( 4 + ((g - r)/(max - min)));
  }
  if (h < 0) {
    h = h + 360;
  }

  h = Math.round(h);
  s = (max) ? Math.round(((max - min)/max) * 100) : 0;
  l = Math.round(max * 100);

  const values = {
    hue: h,
    saturation: s,
    lightness: l
  }

  return values;
}

function hslToString(v) {
  return `hsl(${v.hue}, ${v.saturation}%, ${v.lightness}%)`
}

body.appendChild(createGrid(16));
