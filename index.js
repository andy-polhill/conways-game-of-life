

const game = ({
  width = 100,
  height = 100,
  data
}) => {

  const arrayLength = height * width * 4;
  const canvas = document.getElementById('game');
  const two_count = 255 * 2; 
  const three_count = 255 * 3;
  const four_widths = width * 4;

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

  function loop() {
    let data = [];
    for(let i = 3; i < arrayLength; i+= 4) {
      const four_widths = imageData.width * 4;
      const row = Math.floor(i / four_widths);
      const col = (((i + 1) / 4) - 1) % width; //check this seems to complicated
      const above = row - 1;
      const below = row + 1;
      const left = col - 1;
      const right = col + 1
      const four_cols = col * 4;
      const not_top = above >= 0;
      const not_bottom = below < height;

      const count =
       ((not_top && left >= 0) ? imageData.data[(((above) * (four_widths)) + (left * 4)) + 3] : 0) + // top_left_cell
       ((not_top) ? imageData.data[(((above) * (four_widths)) + four_cols) + 3] : 0) + // top_cell
       ((not_top && right < width) ? imageData.data[(((above) * (four_widths)) + (right * 4)) + 3] : 0) + // top_right_cell
       ((left >= 0) ? imageData.data[((row * (four_widths)) + (left * 4)) + 3] : 0) + // left_cell
       ((right < width) ? imageData.data[((row * (four_widths)) + (right * 4)) + 3] : 0) +  // right_cell
       ((not_bottom && left >= 0) ? imageData.data[(((below) * (four_widths)) + (left * 4)) + 3] : 0) + // bottom_left_cell
       ((not_bottom) ? imageData.data[(((below) * (four_widths)) + four_cols) + 3] : 0) + // bottom_cell
       ((not_bottom && right < width) ? imageData.data[(((below) * (four_widths)) + (right * 4)) + 3] : 0) // bottom_right_cell

      //  if(col === 1 && row === 1) {
      //   console.log(
      //     '\n ============',
      //     '\n i', i,
      //     '\n row', row,
      //     '\n col', col, 
      //     '\n count', count,
      //     `\n top left: ${((above >= 0 && left >= 0) ? imageData.data[(((above) * (imageData.width * 4)) + (left * 4)) + 3] : 0)}`,
      //     `\n top: ${((above >= 0) ? imageData.data[(((above) * (imageData.width * 4)) + four_cols) + 3] : 0)}`,
      //     `\n top right: ${((above >= 0 && right < width) ? imageData.data[(((above) * (imageData.width * 4)) + ((right) * 4)) + 3] : 0)}`,
      //     `\n left: ${((left >= 0) ? imageData.data[((row * (imageData.width * 4)) + (left * 4)) + 3] : 0)}`,
      //     `\n right: ${((right < width) ? imageData.data[((row * (imageData.width * 4)) + ((right) * 4)) + 3] : 0)}`,
      //     `\n bottom left: ${((below < height && left > 0) ? imageData.data[(((below) * (imageData.width * 4)) + (left * 4)) + 3] : 0)}`,
      //     `\n bottom:  ${((below < height) ? imageData.data[(((below) * (imageData.width * 4)) + four_cols) + 3] : 0)}`,
      //     `\n bottom right: ${((below < height && right < width) ? imageData.data[(((below) * (imageData.width * 4)) + ((right) * 4)) + 3] : 0)}`,
      //   );
      // }

      if ((count === three_count) || (count === two_count && imageData.data[i] === 255)) {
        // console.log('survived 🐛');
        data.push([0, 0, 0, 255])
      } else {
        data.push([0, 0, 0, 0])
        // console.log('died 🐛');
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


