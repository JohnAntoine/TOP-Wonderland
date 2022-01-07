const add = (a,b) => a + b;
const substract = (a,b) => a - b;
const multiply = (a,b) => a * b;
const divide = (a,b) => {
  if (!Math.abs(b)) return null;
  return a / b;
}
const operate = (op, a, b) => {
  let parsedA, parsedB, isFloat, mainFactor, factorA, factorB, result;

  if (a.includes('.')) {
    factorA = 10 ** a.split('.')[1].length;
    isFloat = true;
  }
  if (b.includes('.')) {
    factorB = 10 ** b.split('.')[1].length;
    isFloat = true;
  }

  if (isFloat) {
    if (!factorB || factorA >= factorB) {
      mainFactor = factorA;
    } else {
      mainFactor = factorB;
    }
    parsedA = parseInt(parseFloat(a) * mainFactor);
    parsedB = parseInt(parseFloat(b) * mainFactor);
  } else {
    parsedA = parseInt(a);
    parsedB = parseInt(b);
  }

  result = op(parsedA,parsedB);

  return mainFactor ? result / mainFactor : result;
}

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
