// Imports

import logic from './logic.js';
import * as display from './display.js';

// Initialize stateObject

const stateObject = {
  numberA: null,
  numberB: null,
  decimalA: null,
  decimalB: null,
  bufferFull: null,
  operator: null
};

// Generate buttons

const buttonsContainer = document.querySelector('.buttons');
const numbers = [1,2,3,4,5,6,7,8,9,0,'.'];
const operators = ['+','-','*','/','=','AC'];
const buttonBase = document.createElement('button');
const buttonsMain = {... generateButtons()};
const buttonsNumbers = buttonsMain.buttonsNumbers;
const buttonsOperators = buttonsMain.buttonsOperators;

function generateNumbers(numberList) {
  const tempFragment = document.createDocumentFragment();
  numberList.forEach(number => {
    const buttonClone = buttonBase.cloneNode(false);
    buttonClone.textContent = number;
    buttonClone.classList.add('number');
    if (!number) buttonClone.classList.add('number-zero','number-row-four');
    else if (number <= 3) buttonClone.classList.add('number-row-one');
    else if (number <= 6) buttonClone.classList.add('number-row-two');
    else if (number <= 9) buttonClone.classList.add('number-row-three');
    else buttonClone.classList.add('number-row-four');
    tempFragment.appendChild(buttonClone);
  });
  return tempFragment;
}

function generateOperators(operatorList) {
  const tempFragment = document.createDocumentFragment();
  operatorList.forEach(operator => {
    const buttonClone = buttonBase.cloneNode(false);
    buttonClone.textContent = operator;
    buttonClone.classList.add('operator');
    if (operator === '=') buttonClone.classList.add('equal');
    tempFragment.appendChild(buttonClone);
  });
  return tempFragment;
}

function generateButtons() {
  buttonsContainer.appendChild(generateNumbers(numbers));
  buttonsContainer.appendChild(generateOperators(operators));

  const buttonsNumbers = document.querySelectorAll('.number');
  const buttonsOperators = document.querySelectorAll('.operator');

  return {buttonsNumbers, buttonsOperators}
}

// Button Events
const checkNumberOperator = (num, dec, op = false) =>
      (num && !op && (
        (num.length >= 9 && !dec) ||
        (num.length >= 10 && dec)
      ));

const operations = {
  '+': logic.add,
  '-': logic.substract,
  '*': logic.multiply,
  '/': logic.divide,
  'AC': 'AC'
};

function btnPressNumber(e) {
  if (stateObject.bufferFull) {
    console.log('full buffer');
    return;
  }

  let decimalDot = false;
  let lastDigit;
  let target = e.target.textContent;

  if (target === '.' && (stateObject.numberA || stateObject.numberB)) {
    if (stateObject.numberB && !stateObject.decimalB) {
      decimalDot = true;
      stateObject.decimalB = true;
      lastDigit = parseInt(stateObject.numberB) % 10;
    } else if (stateObject.numberA && !stateObject.decimalA) {
      decimalDot = true;
      stateObject.decimalA = true;
      lastDigit = parseInt(stateObject.numberA) % 10;
    } else return;
  } else if (target === '.') return;

  display.addInputNumber(parseInt(target), decimalDot, lastDigit);

  if (checkNumberOperator(stateObject.numberA, stateObject.decimalA, stateObject.operator) ||
      checkNumberOperator(stateObject.numberB, stateObject.decimalB))
        stateObject.bufferFull = true;

  if (!stateObject.numberA) stateObject.numberA = target;
  else if (!stateObject.operator) stateObject.numberA += target;
  else if (!stateObject.numberB) stateObject.numberB = target;
  else stateObject.numberB += target;
  if (stateObject.numberB) console.log(stateObject.numberA, stateObject.operator, stateObject.numberB);
  else console.log(stateObject.numberA);
}

function btnPressOperator(e) {
  const target = e.target.textContent;

  if (target === 'AC') {
    logic.resetCalc(stateObject, display.resetDisplay);
    return;
  }

  if (stateObject.numberA && stateObject.numberA[stateObject.numberA.length - 1] !== '.' &&
      !stateObject.operator && target !== '=') {

    stateObject.operator = target;
    stateObject.decimalA, stateObject.decimalB, stateObject.bufferFull = null,null,null;
    display.displayResult(stateObject,'initial');

  } else if (stateObject.numberB && stateObject.numberB[stateObject.numberB.length - 1] !== '.') {

    const floatA = parseFloat(stateObject.numberA);
    const floatB = parseFloat(stateObject.numberB);
    stateObject.numberA = logic.operate(operations[stateObject.operator], floatA, floatB).toString();
    stateObject.operator = target;
    stateObject.numberB = null;
    stateObject.decimalB = null;
    stateObject.bufferFull = null;
    display.displayResult(stateObject, 'compound');
  }
}

buttonsNumbers.forEach(number => {
  number.addEventListener('click', btnPressNumber);
});

buttonsOperators.forEach(button => {
  button.addEventListener('click', btnPressOperator);
});

display.resetDisplay();
