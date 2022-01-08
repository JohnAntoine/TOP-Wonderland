const add = (a,b,factor) => {
  const result = a + b;
  return factor ? result / factor : result;
}
const substract = (a,b,factor) => {
  const result = a - b;
  return factor ? result / factor : result;
}
const multiply = (a,b,factor) => {
  const result = a * b;
  return factor ? result / factor ** 2 : result;
}
const divide = (a,b,factor) => {
  if (!Math.abs(b)) return null;
  return a / b;
}
const operate = (op, a, b) => {
  let parsedA, parsedB, isFloat, mainFactor, factorA, factorB, result;

  if (a.includes('.')) {
    factorA = a.split('.')[1].length;
    isFloat = true;
  }
  if (b.includes('.')) {
    factorB = b.split('.')[1].length;
    isFloat = true;
  }

  if (isFloat) {
    if (!factorB || factorA >= factorB) {
      mainFactor = 10 ** factorA;
    } else {
      mainFactor = 10 ** factorB;
    }
    parsedA = parseInt(parseFloat(a) * mainFactor);
    parsedB = parseInt(parseFloat(b) * mainFactor);
  } else {
    parsedA = parseInt(a);
    parsedB = parseInt(b);
  }

  result = op(parsedA,parsedB,mainFactor);

  return result;
}

function resetCalc(stateObject, resetDisplay=null) {
  for (let key in stateObject) stateObject[key] = null;
  if (resetDisplay) resetDisplay();
}

export default {
  add,
  substract,
  multiply,
  divide,
  operate,
  resetCalc
}
