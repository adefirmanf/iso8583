function flagActiveBit(binary) {
  let bitValue = new Map();
  let arr = binary.split(1);
  let temp = 0;

  arr.map((n, index) => {
    temp = Number(temp + n.length + 1);
    bitValue.set(temp, '');
  });

  return bitValue;
}

module.exports = flagActiveBit;
