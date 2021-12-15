// Initialize main variables

let numberA, numberB, decimalA, decimalB, bufferFull, operator;

// Generate buttons

const buttonsContainer = document.querySelector('.buttons');
const numbers = [1,2,3,4,5,6,7,8,9,0,'.'];
const operators = ['+','-','*','/'];
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
  '+': add,
  '-': substract,
  '*': multiply,
  '/': divide
};

function btnPressNumber(e) {
  if (bufferFull) {
    console.log('full buffer');
    return;
  }
  let decimalDot = false;
  let lastDigit;
  let target = e.target.textContent;
  if (target === '.' && (numberA || numberB)) {
    if (numberB && !decimalB) {
      decimalDot = true;
      decimalB = true;
      lastDigit = parseInt(numberB) % 10;
    } else if (numberA && !decimalA) {
      decimalDot = true;
      decimalA = true;
      lastDigit = parseInt(numberA) % 10;
    } else return;
  } else if (target === '.') return;
  const digitElement = document.querySelector('.number-svg.reference').cloneNode(true);
  const docFrag = document.createDocumentFragment();
  const displayContainer = document.querySelector('.display-low');

  docFrag.appendChild(digitElement);
  digitElement.classList.remove('reference');
  if (decimalDot) {
    shadeDigit(digitElement, lastDigit, decimalDot);
    displayContainer.firstChild.remove();
  } else {
    shadeDigit(digitElement, parseInt(target));
    displayContainer.lastChild.remove()
  }
  displayContainer.insertBefore(docFrag, displayContainer.firstChild);

  if (checkNumberOperator(numberA, decimalA, operator) ||
      checkNumberOperator(numberB, decimalB))
        bufferFull = true;

  if (!numberA) numberA = target;
  else if (!operator) numberA += target;
  else if (!numberB) numberB = target;
  else numberB += target;
  if (numberB) console.log(numberA, operator, numberB);
  else console.log(numberA);
}

function btnPressOperator(e) {
  target = e.target.textContent;

  if (!operator) {

    operator = target;
    decimalA, decimalB, bufferFull = null;
    const lowDisplay = document.querySelector('.display-low');
    const highDisplay = document.querySelector('.display-high');
    let cloneDisplay = lowDisplay.cloneNode(true);
    cloneDisplay.classList.remove('display-low');
    cloneDisplay.classList.add('display-high');
    cloneDisplay = addOperatorEquality(cloneDisplay, null, operator);
    genDisplayNumbers('.number-svg','.display-low',10);
    highDisplay.parentNode.replaceChild(cloneDisplay, highDisplay);

  } else if (numberB && numberB[numberB.length - 1] !== '.') {

    const floatA = parseFloat(numberA);
    const floatB = parseFloat(numberB);
    numberA = operate(operations[operator], floatA, floatB);
    operator = target;
    numberB = null;
    console.log(`result: ${numberA}`);

  }
}

buttonsNumbers.forEach(number => {
  number.addEventListener('click', btnPressNumber);
});

buttonsOperators.forEach(button => {
  button.addEventListener('click', btnPressOperator);
});

// Generate display
function genDisplayNumbers(svgClass, displayContainer, nOfDigits, withOperators=false) {
  const display = document.querySelector(displayContainer);
  let docFrag = document.createDocumentFragment();
  const numReference = document.querySelector(svgClass);
  const numbers = [];

  for (let i = 0; i < nOfDigits; i++) {
    const newNum = numReference.cloneNode(true);
    newNum.classList.remove('reference');
    numbers.push(newNum);
    docFrag.appendChild(newNum);
  }

  if (withOperators) {
    docFrag = addOperatorEquality(docFrag);
  }

  while (display.firstChild) {
    display.firstChild.remove();
  }

  display.appendChild(docFrag);

  return numbers;
}

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

function addOperatorEquality(displayContainer, equal=null, operator=null) {
  const operatorSvg = document.querySelector('.operator-svg');
  const equalitySvg = document.querySelector('.equality-svg');
  operatorSvg.classList.remove('reference');
  equalitySvg.classList.remove('reference');

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

genDisplayNumbers('.number-svg', '.display-high', 10, true);
genDisplayNumbers('.number-svg', '.display-low', 10);

// Calc Functions

function add(a, b) {
  return a + b;
}

function substract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (!b) return null;
  return a / b;
}

function operate(op, a, b) {
  return op(a,b);
}
