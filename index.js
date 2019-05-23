var lookup = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  a: '1010',
  b: '1011',
  c: '1100',
  d: '1101',
  e: '1110',
  f: '1111',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111'
};

function hexToBinary(s) {
  var ret = '';
  for (var i = 0, len = s.length; i < len; i++) {
    ret += lookup[s[i]];
  }
  return ret;
}
let binary = hexToBinary(`723A4001088180021600000000000022085730000000010000000325112843720954112843032503256011045531133PB2
604210000000000000220805462818601007 0010000000B32019501145678 36000255`);

let BitActive = flagActiveBit(binary);

function flagActiveBit(binary) {
  /**
   * Binary - 0100101011101
   */
  let bitValue = new Map();
  let arr = binary.split(1);
  let temp = 0;
  // let hex = BinaryToHex(binary);
  // let value = arr.map(n => (temp = Number(temp + n.length + 1)));
  arr.map((n, index) => {
    temp = Number(temp + n.length + 1);
    bitValue.set(temp, '');
  });
  return bitValue;
}

// function BinaryToHex(s, splice = 8) {
//   let chunk = s.match(new RegExp('.{1,' + splice + '}', 'g'));
//   return chunk.map(n =>
//     parseInt(n, 2)
//       .toString(16)
//       .toUpperCase()
//   );
// }
console.log(flagActiveBit(binary));
