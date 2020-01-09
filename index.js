/*
 TO TRY
 - arrays per row
 - WebGL
 - WebWorker (unlikely)
 - WebAssembly
*/

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


  const bits_in_row = width * 4;
  const bits_in_height = height * 4;
  const zero_based_width = width - 1;
  const rows = arrayLength / bits_in_height;
  const cols = arrayLength / bits_in_row;

  function loop() {

    for(let r = 0; r < rows; r++) { //row
      for(let c = 0; c < cols; c++) { //col
        const i = ((c * 4) + 3) + (r * bits_in_row);
        const not_top_row = r > 0;
        const not_bottom_row = r < height;
        const not_first_col = c > 0;
        const not_last_col = c < zero_based_width;

        const count =
        ((not_top_row && not_first_col && (imageData.data[(i - bits_in_row - 4)])) ? 1 : 0) +
        ((not_top_row && (imageData.data[(i - bits_in_row)])) ? 1 : 0) +
        ((not_top_row && not_last_col && (imageData.data[(i - bits_in_row + 4)])) ? 1 : 0) +
        ((not_first_col && (imageData.data[(i - 4)])) ? 1 : 0) +
        ((not_last_col && (imageData.data[(i + 4)])) ? 1 : 0) +
        ((not_first_col && not_bottom_row && (imageData.data[(i + bits_in_row - 4)])) ? 1 : 0) +
        ((not_bottom_row && (imageData.data[(i + bits_in_row)])) ? 1 : 0) +
        ((not_last_col && not_bottom_row && (imageData.data[(i + bits_in_row + 4)])) ? 1 : 0);

        if ((count === 3) || (count === 2 && imageData.data[i] === 255)) {
          data[i] = 255
        } 
        else {
          data[i] = 0
        }
  
      }
    }

    // do we need this loop
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





        // const count =
        // (imageData.data[(i - four_widths - 4)] && is_top_row && is_first_col && 1 || 0) +
        // (imageData.data[(i - four_widths)] && is_top_row && 1 || 0) +
        // (imageData.data[(i - four_widths + 4)] && is_top_row && is_last_col && 1 || 0) +
        // (imageData.data[(i - 4)] && is_first_col && 1 || 0) +
        // (imageData.data[(i + 4)] && is_last_col && 1 || 0) +
        // (imageData.data[(i + four_widths - 4)] && is_first_col && is_bottom_row && 1 || 0) +
        // (imageData.data[(i + four_widths)] && is_bottom_row && 1 || 0) +
        // (imageData.data[(i + four_widths + 4)] && is_last_col && is_bottom_row && 1 || 0);

        // console.log(`
        //   r ${r} 
        //   c ${c}
        //   i ${i}
        //   count: ${count}
        //   ${(not_top_row && not_first_col && (imageData.data[(i - four_widths - 4)] && 1) || 0)}
        //   ${(not_top_row && (imageData.data[(i - four_widths)] && 1) || 0)}
        //   ${(not_top_row && not_last_col && (imageData.data[(i - four_widths + 4)] && 1) || 0)}
        //   --
        //   ${not_first_col && (imageData.data[(i - 4)] && 1 || 0)}
        //   ${not_last_col && (imageData.data[(i + 4)] && 1 || 0)}
        //   --
        //   ${not_first_col && not_bottom_row && (imageData.data[(i + four_widths - 4)] && 1 || 0)}
        //   ${not_bottom_row && (imageData.data[(i + four_widths)] && 1 || 0)}
        //   ${not_last_col && not_bottom_row && (imageData.data[(i + four_widths + 4)] && 1 || 0)};
        //   `)


    // for(let i = 3; i < arrayLength; i+= 4) {
    //   // const row = ~~(i / (width * 4));
    //   // const col = (((i + 1) / 4) - 1) % width; //check this seems to complicated
    //   // const above = row - 1;
    //   // const below = row + 1;
    //   // const left = col - 1;
    //   // const right = col + 1;
    //   // const not_top_row = above >= 0;
    //   // const not_bottom_row = below < height;
    //   // const not_first_col = left >= 0;
    //   // const not_last_col = right < width;
    //   // const location = imageData.width * 4;
    //   // const left_location = left * 4;
    //   // const right_location = right * 4;
    //   // const above_location = above * location;
    //   // const below_location = below * location;
    //   // const four_cols = col * 4;

    //   // let mask; // 0 0 0 0 0 0 0 0

    //   // const count2 = 
    //   //   imageData.data[(i - (width * 4) - 4)] +
    //   //   imageData.data[(i - (width * 4))] +
    //   //   imageData.data[(i - (width * 4) + 4)] +
    //   //   imageData.data[(i - 4)] +
    //   //   imageData.data[(i + 4)] +
    //   //   imageData.data[(i + (width * 4) - 4)] +
    //   //   imageData.data[(i + (width * 4))] +
    //   //   imageData.data[(i + (width * 4) + 4)];

    //   //   const tl = imageData.data[(i - (width * 4) - 4)] && 1 || 0;
    //   //   const t = imageData.data[(i - (width * 4))] && 1 || 0;
    //   //   const tr = imageData.data[(i - (width * 4) + 4)] && 1 || 0;
    //   //   const l = imageData.data[(i - 4)] && 1 || 0;
    //   //   const r = imageData.data[(i + 4)] && 1 || 0;
    //   //   const bl = imageData.data[(i + (width * 4) - 4)] && 1 || 0;
    //   //   const b = imageData.data[(i + (width * 4))] && 1 || 0;
    //   //   const br = imageData.data[(i + (width * 4) + 4)] && 1 || 0;

    //   //   const mask = tl | t | tr | l | r | bl | b | br;

    //     // console.log('MASK2: ', tl, t, tr, l, r, bl, b, br)
    //     // console.log('|MASK: ', tl | t | tr | l | r | bl | b | br)
    //     // console.log('&MASK2: ', tl & t & tr & l & r & bl & b & br)

    //     const count =
    //       (imageData.data[(i - (width * 4) - 4)] && 1 || 0) +
    //       (imageData.data[(i - (width * 4))] && 1 || 0) +
    //       (imageData.data[(i - (width * 4) + 4)] && 1 || 0) +
    //       (imageData.data[(i - 4)] && 1 || 0) +
    //       (imageData.data[(i + 4)] && 1 || 0) +
    //       (imageData.data[(i + (width * 4) - 4)] && 1 || 0) +
    //       (imageData.data[(i + (width * 4))] && 1 || 0) +
    //       (imageData.data[(i + (width * 4) + 4)] && 1 || 0);

    //   // console.log(`
    //   //   i: ${i}
    //   //   cell: ${(i + 1) / 4}
    //   //   count: ${count}
    //   //   ${(imageData.data[(i - (width * 4) - 4)] && 1 || 0)}
    //   //   ${(imageData.data[(i - (width * 4))] && 1 || 0)}
    //   //   ${(imageData.data[(i - (width * 4) + 4)] && 1 || 0)}
    //   //   --
    //   //   ${(imageData.data[(i - 4)] && 1 || 0)}
    //   //   ${(imageData.data[(i + 4)] && 1 || 0)}
    //   //   --
    //   //   ${(imageData.data[(i + (width * 4) - 4)] && 1 || 0)}
    //   //   ${(imageData.data[(i + (width * 4))] && 1 || 0)}
    //   //   ${(imageData.data[(i + (width * 4) + 4)] && 1 || 0)}
    //   // `)


    //   // const count =
    //   //  ((not_top_row && not_first_col) ? imageData.data[(above_location + left_location) + 3] : 0) + // top_left_cell
    //   //  (not_top_row ? imageData.data[(above_location + four_cols) + 3] : 0) + // top_cell
    //   //  ((not_top_row && not_last_col) ? imageData.data[(above_location + right_location) + 3] : 0) + // top_right_cell
    //   //  (not_first_col ? imageData.data[((row * location) + left_location) + 3] : 0) + // left_cell
    //   //  (not_last_col ? imageData.data[((row * location) + right_location) + 3] : 0) +  // right_cell
    //   //  ((not_bottom_row && not_first_col) ? imageData.data[(below_location + left_location) + 3] : 0) + // bottom_left_cell
    //   //  (not_bottom_row ? imageData.data[(below_location + four_cols) + 3] : 0) + // bottom_cell
    //   //  ((not_bottom_row && not_last_col) ? imageData.data[(below_location + right_location) + 3] : 0) // bottom_right_cell

    //   // console.log(`count: ${count}, count2: ${count2}`)

    //   // data[i - 3] = 0;
    //   // data[i - 2] = 0;
    //   // data[i - 1] = 0; 

    //   if ((count === 3) || (count === 2 && imageData.data[i] === 255)) {
    //     // console.log('survived 🐛');
    //     data[i] = 255
    //     // data.push(0, 0, 0, 255);
    //   } 
    //   else {
    //     data[i] = 0
    //     // console.log('died 🐛');
    //     // data.push(0, 0, 0, 0);
    //   }
    // }

    // imageData.data = data;

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
