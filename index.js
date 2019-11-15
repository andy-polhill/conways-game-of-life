const width = 400;
const diameter = 2;

const canvas = document.getElementById('game');
canvas.width = width;
canvas.height = width;
const ctx = canvas.getContext('2d');

const off_screen = document.createElement('canvas');
off_screen.width = width;
off_screen.height = width;
const plotter = off_screen.getContext('2d');

let cells = Array
.from({ length: width / diameter })
.map(() => Array.from({ length: width / diameter })
.map(() => Math.round(Math.random())));

function main() {
  plotter.clearRect(0, 0, width, width);
  let next_cells = new Array(width / diameter);

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

      if(!next_cells[x]) next_cells[x] = new Array(width / diameter);

      if((cell === 1 && (count === 3 || count === 2)) || (cell === 0 && count === 3)) {
        plotter.fillStyle = '#1cb500';
        plotter.fillRect(x * diameter, y * diameter, diameter, diameter);  
        next_cells[x][y] = 1;
      } else {
        next_cells[x][y] = 0;
      }
    }
  }

  // var imageData = plotter.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, width, width);
  ctx.drawImage(off_screen, 0, 0);
  cells = next_cells;
  requestAnimationFrame(main);
}

// Start things off
requestAnimationFrame(main);
