import * as svgBase from './svgBase.js';

const svgBaseAggregate = {};

for (let key in svgBase) {
  const docFrag = document.createElement('div');
  docFrag.innerHTML = svgBase[key];
  svgBaseAggregate[key] = docFrag.firstElementChild;
}

export default svgBaseAggregate;
