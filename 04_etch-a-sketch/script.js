// Import color converter
import { Color } from './color.js';


// DOM Query

const body = document.querySelector('body');
const changeMode = document.querySelector('button');


// Mode and Palette

let mode = 1;
let solidColor = new Color('rgb(0, 0, 0)');
let currentColor = new Color('rgb(0, 0, 0)');
let backgroundColor = new Color('rgb(230, 230, 230)');


// Creating and Shading cells

const shadeCell = (e) => {
  detectMode(e);
  e.target.style.backgroundColor = currentColor.rgb();
};


const createGrid = count => {
  const sketchContainer = document.createElement('div');
  sketchContainer.classList.add('sketch', 'container');

  for (let i = 0; i < count * count; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sketch', 'cell');
    cell.style.width = `calc(100% / ${count})`;
    cell.style.height = `calc(100% / ${count})`;
    cell.style.backgroundColor = backgroundColor.rgb();
    cell.addEventListener('mouseenter', shadeCell);
    sketchContainer.appendChild(cell);
  }

  return sketchContainer;
};


changeMode.addEventListener('click', () => {
  if (mode === 4) mode = 0;
  mode++
  switch (mode) {
    case 1:
      document.querySelector('span').textContent = 'Solid Color';
      break;
    case 2:
      document.querySelector('span').textContent = 'Rainbow';
      break;
    case 3:
      document.querySelector('span').textContent = 'Burn';
      break;
    case 4:
      document.querySelector('span').textContent = 'Dodge';
      break;
  }
});


// Helper Functions

function detectMode(e) {
  let bgColor;
  switch (mode) {
    case 1: // solid
      currentColor = new Color(solidColor.rgb());
      break;
    case 2: // Rainbow
      if (currentColor.h >= 350) currentColor.changeHSV({h: currentColor.h - 360});
      currentColor.changeHSV({h: currentColor.h + 10, s: 75, v: 75});
      break;
    case 3: // Burn
      bgColor = window.getComputedStyle( e.target).getPropertyValue('background-color');
      bgColor = new Color(bgColor);
      if (bgColor.v * 100 <= 10) break;
      bgColor.changeHSV({v: (bgColor.v * 100) - 10});
      currentColor = bgColor;
      break;
    case 4: // Dodge
      bgColor = window.getComputedStyle( e.target).getPropertyValue('background-color');
      bgColor = new Color(bgColor);
      if (bgColor.v * 100 >= 90) break;
      bgColor.changeHSV({v: (bgColor.v * 100) + 10});
      currentColor = bgColor;
      break;
  }
}


body.appendChild(createGrid(16));

// Playground
