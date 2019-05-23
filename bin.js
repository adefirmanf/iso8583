const bigNumber = require('bignumber.js');
const lookup = {
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
  let ret = '';
  for (let i = 0, len = s.length; i < len; i++) {
    ret += lookup[s[i]];
  }
  return ret;
}
function bitmapToHex() {
  let _ = [2, 3, 4, 7, 11, 12, 13, 15, 18, 32, 37, 41, 48, 49, 63];
  let binary = [];
  let temp_length = 0;

  _.forEach((n, i) => {
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
  // __;
}

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
/**
 * Created by Ade Firman F - 2019
 * All rights reserved to Billfazz
 */
class ISO8583 {
  constructor(opts) {
    this._opts = opts;
    this._msg = new Map([]);
  }
  init(params) {
    this._temp = new Map(params);
  }
  set(name, value) {
    if (this._temp.get(name)) {
      const { length, bitmap } = this._temp.get(name);
      /**
       * Create 0..n value until meet condition length MAX
       */
      value = new Array(length)
        .fill(0, 0, length)
        /**
         * When value is exist, slice an array with `value.length`
         */
        .slice(value.length)
        /**
         * Split a string and then concat into previous array
         */
        .concat(value.split(''))
        /**
         * Convert into string
         */
        .join('');
      this._msg.set(name, { ...this._temp.get(name), value });
    }
  }
  get(name, value) {}
  wrapMsg(opts) {
    this._string = '';
    let values = this._msg.forEach(n => {
      this._string = this._string.concat(n.value);
    });
    if (opts) {
    }
    // console.log(values.next().value);
    // hexToBinary();
  }

  unpackMsg(hex, opts) {
    const { output = 'array', validate = false } = opts;
    let _Bitmap = [];
    let binary = hexToBinary('');
    // binary;
    // let binary = bigNumber('82200000020000000400000000000000', 16).toString(2);
    binary;
    // console.log(binary);
    //0111001000111010010000000000000100001000100000011000000000000010
    //0111001000111010010000000000000100001000100000011000000000000010
    let arr = binary.split(1);
    let temp = 0;

    arr.map((n, index) => {
      temp = Number(temp + n.length + 1);
      _Bitmap.push([temp]);
    });
    console.log(_Bitmap);
    if (output == 'map') {
      _Bitmap = new Map([_Bitmap]);
    }
  }
}

// let _ = '723A400108818002';
// console.log(_.length);
const XL = new ISO8583();

XL.init([
  ['PRIMARY_ACCOUNT', { bitmap: 2, length: 16 }],
  ['PROCESSING_CODE', { bitmap: 3, length: 6 }],
  ['TRANSACTION_AMOUNT', { bitmap: 4, length: 12 }]
]);

XL.set('PRIMARY_ACCOUNT', '160000000000002208');
XL.set('PROCESSING_CODE', '573000');
XL.set('TRANSACTION_AMOUNT', '10000');

// XL.set('CARDHOLDER_STATUS', '12');

/**
 * Wrap message if there any set mmethods
 */
XL.wrapMsg();

XL.unpackMsg('', {
  output: 'array'
});
