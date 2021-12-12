// Initialize main variables

let numberA, numberB, operator;

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

buttonsNumbers.forEach(number => {
  number.addEventListener('click', e => {
    target = e.target.textContent;
    if (!numberA) numberA = target;
    else if (!operator) numberA += target;
    else if (!numberB) numberB = target;
    else numberB += target;
    if (numberB) console.log(numberA, operator, numberB);
    else console.log(numberA);
  });
});

buttonsOperators.forEach(button => {
  button.addEventListener('click', (e) => {
    target = e.target.textContent;
    if (!operator) operator = target;
    else if (numberB && numberB[numberB.length - 1] !== '.') {
      const floatA = parseFloat(numberA);
      const floatB = parseFloat(numberB);
      switch (operator) {
        case '+':
          numberA = operate(add, floatA, floatB);
          break;
        case '-':
          numberA = operate(substract, floatA, floatB);
          break;
        case '*':
          numberA = operate(multiply, floatA, floatB);
          break;
        case '/':
          numberA = operate(divide, floatA, floatB);
          break;
      }
      operator = target;
      numberB = null;
      console.log(`result: ${numberA}`);
    }

  });
});

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
