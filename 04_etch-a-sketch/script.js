// Import color converter
import { Color } from './color.js';


// DOM Query

const body = document.querySelector('body');
const changeMode = document.querySelector('button');
const colorPicker = document.querySelector('#color-picker');
const cellCountLabel = document.querySelector('label span');
const cellCount = document.querySelector('#cell-count');


// Mouse state, Mode and Palette

let mouseDown = false;
let mode = 1;
let solidColor = new Color('rgb(0, 0, 0)');
let currentColor = new Color('rgb(0, 0, 0)');
let backgroundColor = new Color('rgb(230, 230, 230)');


// get cell count from slider

cellCount.addEventListener('input', (e) => {
  cellCountLabel.textContent = e.target.value;
});
cellCount.addEventListener('change', (e) => {
  body.appendChild(createGrid(e.target.value));
});


// get color from color picker
colorPicker.addEventListener('change', (e) => {
  const color = e.target.value;
  const r = parseInt(color.slice(1,3), 16);
  const g = parseInt(color.slice(3,5), 16);
  const b = parseInt(color.slice(5), 16);
  solidColor = new Color(`rgb(${r}, ${g}, ${b})`);
});


// Creating and Shading cells

const shadeCell = (e) => {
  if (mouseDown) {
    detectMode(e);
    e.target.style.backgroundColor = currentColor.rgb();
  }
};


function createGrid (count) {
  const sketchContainer = document.createElement('div');
  sketchContainer.classList.add('sketch', 'container');

  const oldContainer = document.querySelectorAll('.sketch.container');
  if (oldContainer.length > 0) {
    oldContainer.forEach(container => {
      container.parentElement.removeChild(container);
    });
  }

  for (let i = 0; i < count * count; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sketch', 'cell');
    cell.style.width = `calc(100% / ${count})`;
    cell.style.height = `calc(100% / ${count})`;
    cell.style.backgroundColor = backgroundColor.rgb();
    cell.addEventListener('mousedown', (e) => {
      mouseDown = true;
      shadeCell(e);
    });
    cell.addEventListener('mousemove', shadeCell);
    cell.addEventListener('mouseup', () => mouseDown = false);
    sketchContainer.appendChild(cell);
  }

  return sketchContainer;
};


changeMode.addEventListener('click', () => {
  if (mode === 4) mode = 0;
  mode++
  switch (mode) {
    case 1:
      document.querySelector('.mode').textContent = 'Solid Color';
      break;
    case 2:
      document.querySelector('.mode').textContent = 'Rainbow';
      break;
    case 3:
      document.querySelector('.mode').textContent = 'Darken';
      break;
    case 4:
      document.querySelector('.mode').textContent = 'Lighten';
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
      currentColor = new Color(bgColor);
      bgColor = new Color(bgColor);
      if (bgColor.v * 100 <= 10) break;
      bgColor.changeHSV({v: (bgColor.v * 100) - 10});
      currentColor = bgColor;
      break;
    case 4: // Dodge
      bgColor = window.getComputedStyle( e.target).getPropertyValue('background-color');
      currentColor = new Color(bgColor);
      bgColor = new Color(bgColor);
      if (bgColor.v * 100 >= 95) {
        bgColor.changeHSV({v: 100});
        break;
      }
      bgColor.changeHSV({v: (bgColor.v * 100) + 5});
      currentColor = bgColor;
      break;
  }
}


body.appendChild(createGrid(16));

// Playground
