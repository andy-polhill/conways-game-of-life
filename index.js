

const game = ({
  width = 400,
  height = 400,
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

  // let data = [];
  const two_count = 255 * 2;
  const three_count = 255 * 3;


  function loop() {

    for(let i = 3; i < arrayLength; i+= 4) {
      const row = ~~(i / (width * 4));
      const col = (((i + 1) / 4) - 1) % width; //check this seems to complicated
      const above = row - 1;
      const below = row + 1;
      const left = col - 1;
      const right = col + 1;
      const not_top_row = above >= 0;
      const not_bottom_row = below < height;
      const not_first_col = left >= 0;
      const not_last_col = right < width;
      const location = imageData.width * 4;
      const left_location = left * 4;
      const right_location = right * 4;
      const above_location = above * location;
      const below_location = below * location;
      const four_cols = col * 4;


      const count =
       ((not_top_row && not_first_col) ? imageData.data[(above_location + left_location) + 3] : 0) + // top_left_cell
       (not_top_row ? imageData.data[(above_location + four_cols) + 3] : 0) + // top_cell
       ((not_top_row && not_last_col) ? imageData.data[(above_location + right_location) + 3] : 0) + // top_right_cell
       (not_first_col ? imageData.data[((row * location) + left_location) + 3] : 0) + // left_cell
       (not_last_col ? imageData.data[((row * location) + right_location) + 3] : 0) +  // right_cell
       ((not_bottom_row && not_first_col) ? imageData.data[(below_location + left_location) + 3] : 0) + // bottom_left_cell
       (not_bottom_row ? imageData.data[(below_location + four_cols) + 3] : 0) + // bottom_cell
       ((not_bottom_row && not_last_col) ? imageData.data[(below_location + right_location) + 3] : 0) // bottom_right_cell

      // data[i - 3] = 0;
      // data[i - 2] = 0;
      // data[i - 1] = 0; 

      if ((count === three_count) || (count === two_count && imageData.data[i] === 255)) {
        // console.log('survived 🐛');
        data[i] = 255
        // data.push(0, 0, 0, 255);
      } 
      else {
        data[i] = 0
        // console.log('died 🐛');
        // data.push(0, 0, 0, 0);
      }
    }

    // imageData.data = data;

    for(let i = 0, l = data.length; i < l; i++) { //
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



  //  if(col === 1 && row === 1) {
  //   console.log(
  //     '\n ============',
  //     '\n i', i,
  //     '\n row', row,
  //     '\n col', col, 
  //     '\n count', count,
  //     `\n top left: ${((above >= 0 && left >= 0) ? imageData.data[((above * (imageData.width * 4)) + (left_location)) + 3] : 0)}`,
  //     `\n top: ${((above >= 0) ? imageData.data[((above * (imageData.width * 4)) + (col * 4)) + 3] : 0)}`,
  //     `\n top right: ${((above >= 0 && right < width) ? imageData.data[((above * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
  //     `\n left: ${((left >= 0) ? imageData.data[((row * (imageData.width * 4)) + (left_location)) + 3] : 0)}`,
  //     `\n right: ${((right < width) ? imageData.data[((row * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
  //     `\n bottom left: ${((below < height && left > 0) ? imageData.data[((below * (imageData.width * 4)) + (left_location)) + 3] : 0)}`,
  //     `\n bottom:  ${((below < height) ? imageData.data[((below * (imageData.width * 4)) + (col * 4)) + 3] : 0)}`,
  //     `\n bottom right: ${((below < height && right < width) ? imageData.data[((below * (imageData.width * 4)) + ((col + 1) * 4)) + 3] : 0)}`,
  //   );
  // }
