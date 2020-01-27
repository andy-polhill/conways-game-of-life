const game = ({
  width = 800, // pixels
  height = 800, // pixels
  cell_width = 2, // pixels
  data = []
}) => {

  const cell_height = cell_width;
  const rows = height / cell_width;
  const cols = width / cell_height;
  
  const bits_in_pixel = 4;
  const bits_in_row = width * bits_in_pixel;
  const bits_to_next_marker = bits_in_pixel * cell_width;

  const canvas = document.getElementById('game');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  // TODO: rename this
  const image_data = ctx.getImageData(0, 0, width, height)

  if (typeof data === 'undefined' || !data.length) {
    for(let r = 0; r < rows; r++) { //row
      for(let c = 0; c < cols; c++) { //col
        const i = ((c * 4 * cell_width) + 3) + (r * bits_in_row * cell_height);
        const alpha = Math.round(Math.random()) === 1 ? 255 : 0;
        for(let h = 0; h < cell_width; h++) {
          for(let v = 0; v < cell_height; v++) {
            data[i + (h * 4) + (v * bits_in_row)] = alpha;
          }
        }
      }
    }
  }

  for(let i = 0; i < data.length; i++) {
    image_data.data[i] = data[i];
  }

  ctx.putImageData(image_data, 0, 0);

  function loop() {
    const prev_data = image_data.data.slice(0);

    for(let r = 0; r < rows; r++) { //row
      for(let c = 0; c < cols; c++) { //col
        const i = 3 + 
          (c * bits_in_pixel * cell_width) + 
          (r * bits_in_row * cell_width);

        const not_top_row = r > 0;
        const not_bottom_row = r < rows - 1;
        const not_first_col = c > 0;
        const not_last_col = c < cols - 1;
        const prev_bit = i - bits_to_next_marker;
        const next_bit = i + bits_to_next_marker;

        const count =
          ((not_top_row && not_first_col && (prev_data[(prev_bit - bits_in_row)])) ? 1 : 0) +
          ((not_top_row && (prev_data[(i - bits_in_row)])) ? 1 : 0) +
          ((not_top_row && not_last_col && (prev_data[(next_bit - bits_in_row )])) ? 1 : 0) +
          ((not_first_col && (prev_data[prev_bit])) ? 1 : 0) +
          ((not_last_col && (prev_data[next_bit])) ? 1 : 0) +
          ((not_first_col && not_bottom_row && (prev_data[(i + (bits_in_row * cell_height) - bits_to_next_marker)])) ? 1 : 0) +
          ((not_bottom_row && (prev_data[(i + (bits_in_row * cell_height))])) ? 1 : 0) +
          ((not_last_col && not_bottom_row && (prev_data[(i + (bits_in_row * cell_height) + bits_to_next_marker)])) ? 1 : 0)

        const alpha = (count === 3 || (count === 2 && prev_data[i])) ? 255 : 0;

        for(let h = 0; h < cell_width; h++) {
          for(let v = 0; v < cell_height; v++) {
            image_data.data[i + (h * 4) + (v * bits_in_row)] = alpha;
          }
        }
      }
    }

    ctx.putImageData(image_data, 0, 0);
    requestAnimationFrame(loop); 
  }

  requestAnimationFrame(loop);
}

if  (typeof module !== 'undefined') {
  module.exports = { game }
} else {
  game({});
}
