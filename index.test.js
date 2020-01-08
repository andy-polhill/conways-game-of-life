const { game } = require('./index');
const { createCanvas } = require('canvas');

const expand = str => {
  return str
    .replace(/\s/g, '')
    .replace(/🔵/g, 1)
    .replace(/⚪️/g, 0)
    .split('')
    .reduce((arr, i) => {
      return arr.concat([0, 0, 0, i == 1 ? 255 : 0])
    }, []);
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
    `)).toEqual([
      0, 0, 0, 0, 
      0, 0, 0, 255,
      0, 0, 0, 0,
      0, 0, 0, 255
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
      global.width = 3;
      global.height = 3;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪
          ⚪🔵⚪
          ⚪⚪⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪
          ⚪⚪⚪
          ⚪⚪⚪
        `)
      ));
    });

    test('any live cell with two or three live neighbours lives on', () => {
      global.width = 3;
      global.height = 3;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪
          🔵🔵🔵
          ⚪⚪⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');

      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪🔵⚪
          ⚪🔵⚪
          ⚪🔵⚪
        `)
      ));
    })

    test('any live cell with more than three live neighbours dies', () => {
      global.width = 3;
      global.height = 3;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪🔵⚪
          🔵🔵🔵
          ⚪🔵⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          🔵🔵🔵
          🔵⚪🔵
          🔵🔵🔵
        `)
      ));
    })

    test('dead cell with exactly three live neighbours becomes a live cell', () => {
      global.width = 3;
      global.height = 3;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪🔵⚪
          ⚪🔵⚪
          ⚪🔵⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪
          🔵🔵🔵
          ⚪⚪⚪
        `)
      ));
    })
  });

  describe('still life', () => {
    test('block', () => {
      global.width = 4;
      global.height = 4;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪
          ⚪🔵🔵⚪
          ⚪🔵🔵⚪
          ⚪⚪⚪⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪
          ⚪🔵🔵⚪
          ⚪🔵🔵⚪
          ⚪⚪⚪⚪
        `)
      ));
    });
  
    test('beehive', () => {
      global.width = 6;
      global.height = 5;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪🔵⚪⚪🔵⚪
          ⚪⚪🔵🔵⚪⚪
          ⚪⚪⚪⚪⚪⚪
        `)
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
      `)
      ));
    });

    test('loaf', () => {
      global.width = 6;
      global.height = 6;

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
        `)
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
      `)
      ));
    });

    test('boat', () => {
      global.width = 5;
      global.height = 5;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪🔵🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `)
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
      `)
      ));
    });

    test('tub', () => {
      global.width = 5;
      global.height = 5;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪🔵⚪🔵⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `)
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
      `)
      ));
    });
  });

  describe('oscillators', () => {

    test('blinker', () => {
      global.width = 5;
      global.height = 5;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `)
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
        `)
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪🔵⚪⚪
          ⚪⚪⚪⚪⚪
        `)
      ));
    });

    test('toad', () => {
      global.width = 6;
      global.height = 6;

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
        `)
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
        `)
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
        `)
      ));
    });

    test('beacon', () => {
      global.width = 6;
      global.height = 6;

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
        `)
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
        `)
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
        `)
      ));
    });
  });

  describe('spaceships', () => {
    test('glider', () => {
      global.width = 4;
      global.height = 5;

      game({
        width: global.width,
        height: global.height,
        data: expand(`
          ⚪🔵⚪⚪
          ⚪⚪🔵⚪
          🔵🔵🔵⚪
          ⚪⚪⚪⚪
          ⚪⚪⚪⚪
        `)
      });

      global.tick();
      const ctx = document.getElementById('game').getContext('2d');
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪
          🔵⚪🔵⚪
          ⚪🔵🔵⚪
          ⚪🔵⚪⚪
          ⚪⚪⚪⚪
        `)
      ));

      global.tick();
      expect(ctx.getImageData(0, 0, global.width, global.height).data).toEqual(
        new Uint8ClampedArray(expand(`
          ⚪⚪⚪⚪
          ⚪⚪🔵⚪
          🔵⚪🔵⚪
          ⚪🔵🔵⚪
          ⚪⚪⚪⚪
        `)
      ));
    });
  });

  describe('performance', () => {

    test.only('tick time', () => {
      global.width = 400;
      global.height = 400;

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
      */
    });
  })
});
