const { game } = require('./index');
const { createCanvas } = require('canvas');

const expand = (str, {
  cols,// = 2,
  rows,// = 2,
  cell_width = 2,
  cell_height = 2
}) => {

  const pixels_in_cell = cell_width * cell_height;
  const bits_in_pixel = 4;
  const bits_in_cell = pixels_in_cell * bits_in_pixel;
  const bits_in_picture = bits_in_cell * rows * cols;
  const pixels_in_row = cols * cell_width;
  const bits_in_row = bits_in_pixel * pixels_in_row;
  const data = new Array(bits_in_picture);

  const simplified = str
    .replace(/\s/g, '')
    .replace(/🔵/g, 1)
    .replace(/⚪️/g, 0)
    .split('');

  for(let i = 3; i < bits_in_picture; i += bits_in_pixel) {
    const row = Math.floor((i / bits_in_row) / cell_height);
    const col = Math.floor((((i + 1 - 4) % bits_in_row) / 4) / 2);
    const loc = (row * cols) + col;

    data[i - 3] = 0;
    data[i - 2] = 0;
    data[i - 1] = 0;
    data[i] = simplified[loc] === '1' ? 255 : 0;
  }

  return data;
}

const contract = (arr, width) => {
  return arr
    .reduce((str, i, l) => {
      const mod = (l + 1) % 4;
      if(mod === 0 && i === 255) {
        str = `${str}🔵`
      }
      if(mod === 0 && i === 0) {
        str = `${str}⚪️`
      }
      if(((l + 1) / 4) % width === 0) {
        str = `${str}\n`;
      }
      return str;
    }, '')
}

afterEach(() => {
  global.canvas = undefined;
})

describe('canvas test', () => {

  test('it supports basic data functionality', () => {
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, 1, 1);

    imageData.data[0] = 0;
    imageData.data[1] = 0;
    imageData.data[2] = 0;
    imageData.data[3] = 255;

    ctx.putImageData(imageData, 0, 0);
    expect([...ctx.getImageData(0, 0, 1, 1).data])
      .toEqual(expect.arrayContaining([0, 0, 0, 255]));
  });
});

describe('expand', () => {
  test('expands a single binary style array to rgba array', () => {

    expect(expand(`
      ⚪️🔵
      ⚪️🔵
    `, { rows: 2, cols: 2 })).toEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 255,
      0, 0, 0, 255,

      0, 0, 0, 0, //next row
      0, 0, 0, 0,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 255,
      0, 0, 0, 255
    ])

  //   console.log(expand(`
  //   ⚪️⚪️⚪️
  //   🔵🔵🔵
  //   ⚪️⚪️⚪️
  // `, { rows: 3, cols: 3 }));

    expect(expand(`
      ⚪️⚪️⚪️
      🔵🔵🔵
      ⚪️⚪️⚪️
    `, { rows: 3, cols: 3 })).toEqual([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,

      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      //next row 
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,

      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
      //next row
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,

      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  })
});

describe('contract', () => {
  test('contracts an rgba array to single binary style', () => {
    expect(contract([
      0, 0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 255 
    ], 2).replace(/\s/g, '')).toEqual(`
      ⚪️🔵
      ⚪️🔵
    `.replace(/\s/g, ''))
  })
});

describe('conways', () => {

  describe('rules', () => {

    test('any live cell with fewer than two live neighbours dies', () => {
      const rows = 3;
      const cols = 3;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        cell_width: 2,
        data: expand(`
          ⚪⚪⚪
          ⚪🔵⚪
          ⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');

      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪
          ⚪⚪⚪
          ⚪⚪⚪
        `, { rows, cols })
      ));

    });

    test('simple', () => {
      const rows = 2;
      const cols = 2;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        cell_width: 2,
        data: expand(`
          ⚪🔵
          🔵⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');

      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪
          ⚪⚪
        `, { rows, cols })
      ));
    })

    test('any live cell with two or three live neighbours lives on', () => {
      const rows = 3;
      const cols = 3;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        cell_width: 2,
        data: expand(`
          ⚪⚪⚪
          🔵🔵🔵
          ⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');

      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪🔵⚪
          ⚪🔵⚪
          ⚪🔵⚪
        `, { rows, cols })
      ));
    })

    test('any live cell with more than three live neighbours dies', () => {
      const rows = 3;
      const cols = 3;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        cell_width: 2,
        data: expand(`
          ⚪🔵⚪
          🔵🔵🔵
          ⚪🔵⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          🔵🔵🔵
          🔵⚪🔵
          🔵🔵🔵
        `, { rows, cols })
      ));
    })

    test('dead cell with exactly three live neighbours becomes a live cell', () => {
      const rows = 3;
      const cols = 3;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪🔵⚪
          ⚪🔵⚪
          ⚪🔵⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪
          🔵🔵🔵
          ⚪⚪⚪
        `, { rows, cols })
      ));
    })
  });

  describe('still life', () => {
    test('block', () => {
      const rows = 4;
      const cols = 4;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪
          ⚪🔵🔵⚪
          ⚪🔵🔵⚪
          ⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪
          ⚪🔵🔵⚪
          ⚪🔵🔵⚪
          ⚪⚪⚪⚪
        `, { rows, cols })
      ));
    });
  
    test('beehive', () => {
      const rows = 6;
      const cols = 6;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      });
  
      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
          `, { rows, cols })
      ));
    });

    test('loaf', () => {
      const rows = 6;
      const cols = 6;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵⚪🔵⚪
          ⚪⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      });
  
      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵⚪🔵⚪
          ⚪⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
      `, { rows, cols })
      ));
    });

    test('boat', () => {
      const rows = 5;
      const cols = 5;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      });
  
      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
      `, { rows, cols })
      ));
    });

    test('tub', () => {
      const rows = 5;
      const cols = 5;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
      `, { rows, cols })
      ));
    });
  });

  describe('oscillators', () => {

    test('blinker', () => {
      const rows = 5;
      const cols = 5;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪
          ⚪🔵🔵🔵⚪
          ⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));
    });

    test('toad', () => {
      const rows = 6;
      const cols = 6;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵🔵⚪
          ⚪🔵🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪⚪🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵⚪⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));
    });

    test('beacon', () => {
      const rows = 6;
      const cols = 6;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪⚪
          ⚪🔵🔵⚪⚪⚪
          ⚪⚪⚪🔵🔵⚪
          ⚪⚪⚪🔵🔵⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪⚪
          ⚪🔵⚪⚪⚪⚪
          ⚪⚪⚪⚪🔵⚪
          ⚪⚪⚪🔵🔵⚪
          ⚪⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪⚪
          ⚪🔵🔵⚪⚪⚪
          ⚪⚪⚪🔵🔵⚪
          ⚪⚪⚪🔵🔵⚪
          ⚪⚪⚪⚪⚪⚪
        `, { cols, rows })
      ));
    });
  });

  describe('spaceships', () => {
    xtest('glider', () => {
      const rows = 5;
      const cols = 5;
      const cell_width = 2;
      const cell_height = 2;

      global.width = rows * cell_width;
      global.height = cols * cell_height;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪🔵⚪⚪⚪
          ⚪⚪🔵⚪⚪
          🔵🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          🔵⚪⚪🔵⚪
          ⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          🔵⚪🔵⚪⚪
          ⚪🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `, { rows, cols })
      ));
    });
  });

  describe('performance', () => {

    test('tick time', () => {
      global.width = 650;
      global.height = 650;

      game({
        width: global.width,
        height: global.height
      });

      const times = []
      const iterations = 10;

      let before;
      let after;
      for(let i = 0; i < iterations; i++) {
        before = performance.now();
        global.tick();
        after = performance.now();
        times.push(Math.round(after - before));  
      }

      const fps = times
        .map(t => 1000 / t)
        .reduce((acc, fps) => acc + fps, 0) / iterations;

      // 80 = 7.2
      console.log('fps: ', fps);
      // expect(fps).toBeGreaterThan(10);

      /*
        Results at w = 50 & h = 50
        | Iterations  | Dimension | FPS   | Notes                                 |
        | ----------- |:---------:|:-----:|:-------------------------------------:|
        | 10          | 50        | 44    |                                       |
        | 10          | 50        | 47    |                                       |
        | 10          | 50        | 267   | Array.concat to Array.push            |
        | 10          | 100       | 134   |                                       |
        | 10          | 100       | 134   | Not using push but using typed array  |
        | 10          | 150       | 66    |                                       |
        | 10          | 150       | 88    |  use ~~ instead of Math.floor         |
        | 10          | 180       | 59    |                                       |
        | 10          | 180       | 70    | reduce repetition of simple maths                                      |
        | 10          | 180       | 170   | reduce additional multiplication                                      |
        | 10          | 300       | 64    | reduce additional multiplication                                      |
        | 10          | 300       | 68    | reduce additional multiplication                                      |
        | 10          | 300       | 127   | remove array initialisation           |
        | 10          | 400       | 70    |                                         |
        | 10          | 400       | 76    | cache imageData.data to another var                                         |
        | 10          | 450       | 62    |                                        |
        | 10          | 450       | 124   | remove duplicate loop by doing slice at start |
        | 10          | 600       | 63   |  |
        | 10          | 650       | 60   | More maths reduction  |
        */
    });
  })
});
