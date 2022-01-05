const add = (a,b) => a + b;
const substract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => {
  if (!b) return null;
  return a / b;
}
const operate = (op, a, b) => op(a,b);

function resetCalc(stateObject, resetDisplay) {
  for (let key in stateObject) stateObject[key] = null;
  resetDisplay();
}

export default {
  add,
  substract,
  multiply,
  divide,
  operate,
  resetCalc
}
