const body = document.querySelector('body');


const createGrid = count => {
  const sketchContainer = document.createElement('div');
  sketchContainer.classList.add('sketch', 'container');

  for (let i = 0; i < count * count; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sketch', 'cell');
    cell.style.width = `calc(100% / ${count})`;
    cell.style.height = `calc(100% / ${count})`;
    sketchContainer.appendChild(cell);
  }

  return sketchContainer;
};


body.appendChild(createGrid(64));
