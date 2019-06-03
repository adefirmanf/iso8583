const bigNumber = require('bignumber.js');

function bitmapToHex(bitmap) {
  let binary = [];
  let temp_length = 0;

  bitmap.forEach((n, i) => {
    let length = n - temp_length;
    binary = binary.concat(new Array(length - 1).fill(0).concat([1]));
    temp_length = n;
  });
  if (binary.length % 8 < 8) {
    binary = binary.concat(
      new Array(binary.length - (binary.length % 8) + 8 - binary.length).fill(0)
    );
  }
  return bigNumber(binary.join(''), 2).toString(16);
}

module.exports = bitmapToHex;
