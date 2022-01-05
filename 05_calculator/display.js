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
  9: '.topH,.middleH,.bottomH,.topLeftV,.topRightV,.bottomRightV'
}

// Helper Functions
function getDisplays() {
  return {
    top: document.querySelector('.display-top'),
    bottom: document.querySelector('.display-bottom')
  }
}

export function getSVG(type) {
  return svgBase[type].cloneNode(true);
}

// Generate Display
export function genDisplayNumbers(displayContainer, nOfDigits, withOperators=false) {
  const docFrag = document.createDocumentFragment();
  const numbers = [];

  while (displayContainer.firstChild) {
    displayContainer.firstChild.remove();
  }

  for (let i = 0; i < nOfDigits; i++) {
    const newNum = getSVG('number');
    newNum.classList.remove('reference');
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

export function displayResult(stateObject, state) {
  const display = { ... getDisplays() };

  switch(state) {
    case 'initial':
      const cloneDisplay = display.bottom.cloneNode(true);
      cloneDisplay.classList.remove('display-bottom');
      cloneDisplay.classList.add('display-top');
      const cloneDisplayOp = addOperatorEquality(cloneDisplay, null, stateObject.operator);
      genDisplayNumbers(display.bottom, 10);
      display.top.parentNode.replaceChild(cloneDisplayOp, display.top);
      break;
    case 'compound':
      const compoundFragment = document.createElement('div');
      compoundFragment.classList.add('display-top');
      stateObject.numberA.split('').forEach(digit => {
        const digitClone = svgBase.number.cloneNode(true);
        shadeDigit(digitClone, parseInt(digit));
        digitClone.classList.remove('reference')
        compoundFragment.insertBefore(digitClone ,compoundFragment.firstChild);
        // compoundFragment.appendChild(digitClone);
      });
      for (let i = compoundFragment.childElementCount; i < 10; i++) {
        const digitClone = svgBase.number.cloneNode(true);
        digitClone.classList.remove('reference')
        compoundFragment.appendChild(digitClone);
      }
      genDisplayNumbers(display.bottom, 10);
      display.top.parentNode.replaceChild(compoundFragment, display.top);
      console.log(compoundFragment);
      break;

  }

}

export function addOperatorEquality(displayContainer, equal=null, operator=null) {
  const operatorSvg = getSVG('operator').cloneNode(true);
  const equalitySvg = getSVG('equality').cloneNode(true);

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

export function shadeDigit(numberElement, digit, dot=false) {
  const segmentsSelected = numberElement.querySelectorAll(numberShading[digit]);

  segmentsSelected.forEach(shaded => {
    shaded.classList.add('shaded');
  });

  if (dot) numberElement.querySelector('circle').classList.add('shaded');
}
