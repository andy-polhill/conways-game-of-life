const { createCanvas } = require('canvas');

console.log('setup jest');
global.canvas;
global.width;
global.height;
global.tick;

global.requestAnimationFrame = (fn) => {
  global.tick = () => {
    console.log('tick');
    fn();
  }
}

global.document.getElementById = (id) => {
  // console.log(`getElementById: ${global.canvas}`)
  if (id === 'game' && !global.canvas) {
    // console.log('create canvas');
    global.canvas = createCanvas(global.width, global.height);
    return global.canvas;
  }
  if(id === 'game' && global.canvas) {
    // console.log('get canvas');
    return global.canvas;
  }
  
  return document.getElementById(id);
}



document.body.innerHTML = `<canvas id="game"></canvas>`;
