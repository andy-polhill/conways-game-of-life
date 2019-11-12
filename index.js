const width = 600;
const diameter = 4;

const canvas = document.getElementById('game');
canvas.width = width;
canvas.height = width;
const ctx = canvas.getContext('2d');

const off_screen = document.createElement('canvas');
off_screen.width = width;
off_screen.height = width;
const plotter = canvas.getContext('2d');

function update(cells) {
  plotter.clearRect(0, 0, width, width);

  const next_cells = [];

  for(let x = 0; x < cells.length; x++) { 
    let row = cells[x];
    for(let y = 0; y < row.length; y++) {
      const cell = cells[x][y];
      let count =
      ((cells[x - 1] && cells[x - 1][y - 1]) ? cells[x - 1][y - 1] : 0) +
      ((cells[x - 1] && cells[x - 1][y]) ? cells[x - 1][y] : 0) +
      ((cells[x - 1] && cells[x - 1][y + 1]) ? cells[x - 1][y + 1] : 0) +
      ((cells[x] && cells[x][y - 1]) ? cells[x][y - 1] : 0) +
      ((cells[x] && cells[x][y + 1]) ? cells[x][y + 1] : 0) +
      ((cells[x + 1] && cells[x + 1][y - 1]) ? cells[x + 1][y - 1] : 0) +
      ((cells[x + 1] && cells[x + 1][y]) ? cells[x + 1][y] : 0) +
      ((cells[x + 1] && cells[x + 1][y + 1]) ? cells[x + 1][y + 1] : 0);

      if(!next_cells[x]) next_cells[x] = [];

      if((cell === 1 && (count === 3 || count === 2)) || (cell === 0 && count === 3)) {
        plotter.fillStyle = '#1cb500';
        plotter.fillRect(x * diameter, y * diameter, diameter, diameter);  
        next_cells[x][y] = 1;
      } else {
        next_cells[x][y] = 0;
      }
    }
  }

  ctx.drawImage(off_screen, 0, 0);
  return next_cells;
}

function main(cells) {  
  const next = update(cells);
  requestAnimationFrame(() => main(next));
}

// Start things off
requestAnimationFrame(() => main(Array
  .from({ length: width / diameter })
  .map(() => Array.from({ length: width / diameter })
  .map(() => Math.round(Math.random())))));
