// Imports

import svgBase from './svgHelper.js';

// Shading Selectors
const operatorShading = {
  '+': '.dot,.v1,.v2,.h1,.h2',
  '-': '.dot,.h1,.h2',
  '*': '.dot,.d1,.d2,.d3,.d4',
  '/': '.dot,.d2,.d4'
}

const numberShading = {
  0: '.topH,.bottomH,.topLeftV,.bottomLeftV,.topRightV,.bottomRightV',
  1: '.topRightV,.bottomRightV',
  2: '.topH,.middleH,.bottomH,.bottomLeftV,.topRightV',
  3: '.topH,.middleH,.bottomH,.topRightV,.bottomRightV',
  4: '.middleH,.topLeftV,.topRightV,.bottomRightV',
  5: '.topH,.middleH,.bottomH,.topLeftV,.bottomRightV',
  6: '.topH,.middleH,.bottomH,.topLeftV,.bottomLeftV,.bottomRightV',
  7: '.topH,.topRightV,.bottomRightV',
  8: '.topH,.middleH,.bottomH,.topLeftV,.bottomLeftV,.topRightV,.bottomRightV',
  9: '.topH,.middleH,.bottomH,.topLeftV,.topRightV,.bottomRightV',
  10: '.middleH'
}

// Helper Functions
function getDisplays() {
  return {
    top: document.querySelector('.display-top'),
    bottom: document.querySelector('.display-bottom')
  }
}

function getSVG(type) {
  return svgBase[type].cloneNode(true);
}

// Generate Display
function genDisplayNumbers(displayContainer, nOfDigits, withOperators=false) {
  const docFrag = document.createDocumentFragment();
  const numbers = [];

  while (displayContainer.firstChild) {
    displayContainer.firstChild.remove();
  }

  for (let i = 0; i < nOfDigits; i++) {
    const newNum = getSVG('number');
    numbers.push(newNum);
    docFrag.appendChild(newNum);
  }

  if (withOperators) {
    const docFragOp = addOperatorEquality(docFrag);
    displayContainer.appendChild(docFragOp);
  } else {
    displayContainer.appendChild(docFrag);
  }

  return numbers;
}

export function resetDisplay() {
  const display = { ... getDisplays() };
  genDisplayNumbers(display.top, 10, true);
  genDisplayNumbers(display.bottom, 10);
}

export function displayResult(stateObject) {
  const display = { ... getDisplays() };

  const displayFragment = document.createElement('div');
  displayFragment.classList.add('display-top');
  genDisplayNumbers(displayFragment, 10);
  let lastDigit;

  stateObject.numberA.split('').forEach(digit => {
    switch (digit) {
      case '.':
        addDisplayNumber({ decimalDot: true, lastDigit, display: displayFragment });
        break;
      case '-':
        addDisplayNumber({ number: 10, display: displayFragment });
        break;
      default:
        addDisplayNumber({ number: parseInt(digit), display: displayFragment });
        lastDigit = parseInt(digit);
        break;
    }
  });

  addOperatorEquality(displayFragment, null, stateObject.operator);
  genDisplayNumbers(display.bottom, 10);
  display.top.parentNode.replaceChild(displayFragment, display.top);
}

export function addDisplayNumber({number, decimalDot, lastDigit, display=null}) {
  if (!display) display = {...getDisplays()}.bottom;

  const digitElement = getSVG('number');
  const docFrag = document.createDocumentFragment();

  docFrag.appendChild(digitElement);
  if (decimalDot) {
    shadeDigit(digitElement, lastDigit, decimalDot);
    display.firstChild.remove();
  } else {
    shadeDigit(digitElement, number);
    display.lastChild.remove()
  }
  display.insertBefore(docFrag, display.firstChild);
};

function addOperatorEquality(displayContainer, equal=null, operator=null) {
  const operatorSvg = getSVG('operator');
  const equalitySvg = getSVG('equality');

  switch (equal) {
    case null:
      break;
    case 'equality':
      equalitySvg.querySelectorAll('.eq').forEach(dash => {
        dash.classList.add('shaded');
      });
      break;
    case 'approx':
      equalitySvg.querySelectorAll('.approx').forEach(dash => {
        dash.classList.add('shaded');
      });
      break;
  }

  if (operator !== null) {
    operatorSvg.querySelectorAll(operatorShading[operator]).forEach(dash => {
      dash.classList.add('shaded');
    });
  }

  displayContainer.appendChild(equalitySvg);
  displayContainer.insertBefore(operatorSvg, displayContainer.firstChild);

  return displayContainer;

}

function shadeDigit(numberElement, digit, dot=false) {
  const segmentsSelected = numberElement.querySelectorAll(numberShading[digit]);

  segmentsSelected.forEach(shaded => {
    shaded.classList.add('shaded');
  });

  if (dot) numberElement.querySelector('circle').classList.add('shaded');
}
