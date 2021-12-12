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

console.log(operate(divide, 1, 0));
