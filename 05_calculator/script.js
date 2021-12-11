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
