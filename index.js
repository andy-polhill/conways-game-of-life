const width = 700;
const diameter = 3;
const seed = 0.3;

const canvas = document.getElementById('game');
canvas.width = width;
canvas.height = width;
const ctx = canvas.getContext('2d');


function get(cells, path) {
  let result = 0;
  try {
    result = cells[path[0]][path[1]]
  } catch(e) {
    result = 0
  }
  if(!result) result = 0;
  return result;
}

function update(cells) {
  return cells.map((row, x) => {
    return row.map((cell, y) => {
      let result = [
        get(cells, [x - 1, y - 1]),
        get(cells, [x - 1, y]),
        get(cells, [x - 1, y + 1]),
        get(cells, [x, y - 1]),
        get(cells, [x, y + 1]),
        get(cells, [x + 1, y - 1]),
        get(cells, [x + 1, y]),
        get(cells, [x + 1, y + 1]),
      ];
      
      result = result.reduce((a, b) => a + b, 0);

      if(cell === 1) {
        if (result < 2 || result > 3) {
          return 0
        }
        return 1;
      } else {
        if(result === 3) {
          return 1;
        }
      }
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, width, width);
  cells
    .forEach((row, x) => row.forEach((cell, y) => {
      if (cell) {
        ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(x * diameter, y * diameter, diameter, diameter);
      }
    }));  
}

function main() {


  draw(cells);
  cells = update(cells);
  requestAnimationFrame(() => main(cells));
}

let cells = Array.from({ length: width / diameter })
.map(() => Array.from({ length: width / diameter })
.map(() => Math.round(Math.random() - seed)));


// Start things off
requestAnimationFrame(() => main(cells));
