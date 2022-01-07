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
  operator: null,
  approx: null,
  afterEquality: null,
  error: null
};

// Generate buttons

const buttonsContainer = document.querySelector('.buttons');
const numbers = ['1','2','3','4','5','6','7','8','9','0','.'];
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
    if (number === '0') buttonClone.classList.add('number-zero','number-row-four');
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
  if (stateObject.error) {
    logic.resetCalc(stateObject, display.resetDisplay);
  }
  if (stateObject.bufferFull) {
    console.log('full buffer');
    return;
  }
  if (stateObject.afterEquality) {
    stateObject.numberA = null;
    stateObject.afterEquality = null;
  }

  let decimalDot = false;
  let lastDigit;
  let target;
  if (e.key) {
    target = e.key;
  } else {
    target = e.target.textContent;
  }

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

  display.addDisplayNumber({number: parseInt(target), decimalDot, lastDigit});

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
  if (stateObject.afterEquality) stateObject.afterEquality = null;

  let target;
  if (e.key === 'Enter') target = '=';
  else if (e.key) target = e.key;
  else target = e.target.textContent;

  if (target === 'AC') {
    logic.resetCalc(stateObject, display.resetDisplay);
    return;
  } else if (target === '-') {
    if (!stateObject.numberA) {
      display.resetDisplay();
      stateObject.error = null;
      stateObject.numberA = '-';
      display.addDisplayNumber({number: 10});
      return;
    } else if (stateObject.operator && !stateObject.numberB) {
      stateObject.numberB = '-';
      display.addDisplayNumber({number: 10});
      return;
    }
  }

  if (stateObject.numberA &&
      stateObject.numberA[stateObject.numberA.length - 1] !== '.' &&
      stateObject.numberA[stateObject.numberA.length - 1] !== '-' &&
      !stateObject.operator && target !== '=') {

    stateObject.operator = target;
    stateObject.decimalA = null;
    stateObject.decimalB = null;
    stateObject.bufferFull = null;
    display.displayResult(stateObject);

  } else if (stateObject.numberB &&
             stateObject.numberB[stateObject.numberB.length - 1] !== '-' &&
             stateObject.numberB[stateObject.numberB.length - 1] !== '.') {

    stateObject.numberA = logic.operate(operations[stateObject.operator], stateObject.numberA, stateObject.numberB);
    if (!stateObject.numberA) {
      logic.resetCalc(stateObject, display.errorDisplay);
      stateObject.error = true;
      return;
    }
    if (stateObject.numberA.toString().length > 10) {
      stateObject.numberA = (Math.floor(stateObject.numberA * 10**4) / 10**4).toString();
      stateObject.approx = true;
    } else stateObject.numberA = stateObject.numberA.toString();

    stateObject.operator = target;
    stateObject.numberB = null;
    stateObject.decimalB = null;
    stateObject.bufferFull = null;
    display.displayResult(stateObject);
    stateObject.approx = null;
    if (target === '=') {
      stateObject.operator = null;
      stateObject.afterEquality = true;
    }
  }
}

// Event Listners

buttonsNumbers.forEach(number => {
  number.addEventListener('click', btnPressNumber);
});

buttonsOperators.forEach(button => {
  button.addEventListener('click', btnPressOperator);
});

window.addEventListener('keypress', (e) => {
  if (numbers.includes(e.key)) btnPressNumber(e);
  else if (operators.includes(e.key)) btnPressOperator(e);
  else if (e.key === 'Enter') btnPressOperator(e);
  else if (e.key === 'c') logic.resetCalc(stateObject, display.resetDisplay);
  else console.log(e.key);
});

display.resetDisplay();
