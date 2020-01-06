

const game = ({
  width = 100,
  height = 100,
  data
}) => {

  const arrayLength = height * width * 4;
  const canvas = document.getElementById('game');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, width, height)

  if (typeof data === 'undefined' || !data.length) {
    // generate random data if none is provided
    data = [];
    for(let i = 0; i < arrayLength; i++) { //
      data[i] = 0;
    }
    for(let i = 3; i < arrayLength; i+= 4) {
      data[i] = Math.round(Math.random()) === 1 ? 255 : 0
    }
  }

  for(let i = 0; i < data.length; i++) {
    imageData.data[i] = data[i];
  }

  // set the initial state
  ctx.putImageData(imageData, 0, 0);

  // primary loop, keep optimised
  function loop() {
    console.log('---- loop');
    let data = [];
    for(let i = 3; i < arrayLength; i+= 4) {
      const row = Math.floor(i / (width * 4));
      const col = (((i + 1) / 4) - 1) % width; //check this seems to complicated
      const above = row - 1;
      const below = row + 1;
      const left = col - 1;
      const right = col + 1

      const count =
       ((above >= 0 && left >= 0) ? imageData.data[(((row - 1) * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0) + // top_left_cell
       ((above >= 0) ? imageData.data[(((row - 1) * (imageData.width * 4)) + (col * 4)) + 3] : 0) + // top_cell
       ((above >= 0 && right < width) ? imageData.data[(((row - 1) * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0) + // top_right_cell
       ((left >= 0) ? imageData.data[((row * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0) + // left_cell
       ((right < width) ? imageData.data[((row * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0) +  // right_cell
       ((below < height && left >= 0) ? imageData.data[(((row + 1) * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0) + // bottom_left_cell
       ((below < height) ? imageData.data[(((row + 1) * (imageData.width * 4)) + (col * 4)) + 3] : 0) + // bottom_cell
       ((below < height && right < width) ? imageData.data[(((row + 1) * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0) // bottom_right_cell

      //  if(col === 1 && row === 1) {
      //   console.log(
      //     '\n ============',
      //     '\n i', i,
      //     '\n row', row,
      //     '\n col', col, 
      //     '\n count', count,
      //     `\n top left: ${((above >= 0 && left >= 0) ? imageData.data[(((row - 1) * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0)}`,
      //     `\n top: ${((above >= 0) ? imageData.data[(((row - 1) * (imageData.width * 4)) + (col * 4)) + 3] : 0)}`,
      //     `\n top right: ${((above >= 0 && right < width) ? imageData.data[(((row - 1) * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
      //     `\n left: ${((left >= 0) ? imageData.data[((row * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0)}`,
      //     `\n right: ${((right < width) ? imageData.data[((row * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
      //     `\n bottom left: ${((below < height && left > 0) ? imageData.data[(((row + 1) * (imageData.width * 4)) + ((col - 1) * 4)) + 3] : 0)}`,
      //     `\n bottom:  ${((below < height) ? imageData.data[(((row + 1) * (imageData.width * 4)) + (col * 4)) + 3] : 0)}`,
      //     `\n bottom right: ${((below < height && right < width) ? imageData.data[(((row + 1) * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
      //   );
      // }

      if ((count === 255 * 3) || (count === (255 * 2) && imageData.data[i] === 255)) {
        // console.log('survived 🐛');
        data = data.concat([0, 0, 0, 255])
      } else {
        // console.log('died 🐛');
        data = data.concat([0, 0, 0, 0])
      }
    }

    for(let i = 0; i < data.length; i++) { //
      imageData.data[i] = data[i];
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(loop); 
  }

  requestAnimationFrame(loop);
}

if  (typeof module !== 'undefined') {
  module.exports = {
    game
  }
} else {
  game({});
}


