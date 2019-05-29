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
function bitmapToHex(bitmap) {
  let binary = [];
  let temp_length = 0;

  bitmap.forEach((n, i) => {
    console.log(i);
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
// let ____ = bitmapToHex([1, 7, 11, 70]);
// console.log(____);
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

// console.log(___);
/**
 * Created by Ade Firman F - 2019
 * All rights reserved to Billfazz
 */
class ISO8583 {
  constructor(opts) {
    this._opts = opts;
    this._msg = new Map([]);
    this._value;
    this._header = opts.header;
    /**
     * SET HEADER IF EXIST
     */
  }
  init(params) {
    this._temp = new Map(params);
  }
  static value(data) {}
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

      this._value = new Map([]);
      this._value.set(name, { ...this._temp.get(name), value });
      // console.log(this._value);
    }
  }
  get(name, value) {}
  wrapMsg(opts) {
    this._string = '';
    let bitmap = [];
    let total_length = 0;
    let primary_m = 0;
    let primary_s = 0;

    this._msg.forEach(n => {
      total_length = total_length + n.length;
      this._string = this._string.concat(n.value);
      bitmap.push(n.bitmap);
    });
    let hex = bitmapToHex(bitmap).substring(0, 16);
    // console.log(this._string);
    this._msg.set('PRIMARY_BITMAP', {
      name: 'PRIMARY_BITMAP',
      bitmap: false,
      value: hex.substring(0, 16)
    });
    // if (length > 65) {
    //   hex.concat();
    // }

    this._string = hex + this._string;
    return this._string;
  }

  unpackMsg(hex, opts) {
    const { output = 'array', validate = false } = opts;

    /**
     * Set a type
     */
    this._type = hex.substring(
      this._header.length,
      parseInt(this._header.length + 4)
    );
    /**
     * Substring the message based on header + (4 = Message type)
     */
    hex = hex.substring(parseInt(this._header.length + 4));
    /**
     * Storage for saving a bitmap
     */
    let _Bitmap = new Map([]);
    /**
     * Convert hexToBinary
     */
    let binary = hexToBinary(hex);
    /**
     * Splitting the binary with delimiter 1
     */
    let arr = binary.split(1);
    /**
     *
     */
    let temp = 0;

    arr.map((n, index) => {
      temp = Number(temp + n.length + 1);
      _Bitmap.set(temp, '');
    });
    _Bitmap;
    // console.log(hex);

    /**
     * TODO :
     *
     * HEADER - DONE IN CONSTRUCTOR
     * PRIMARY BITMAP
     * MESSAGE TYPE - 4 Digit of element
     *
     */

    /**
     * Set as Primary Bitmap
     */

    _Bitmap.set('PRIMARY_BITMAP', hex.substring(0, 16));
    _Bitmap.set('MESSAGE_TYPE', this._type);
    // _Bitmap.set('TYPE', hex.substring());
    hex = hex.substring(16, hex.length + 16);

    let init = 0;
    this._temp.forEach((n, key, index) => {
      if (_Bitmap.has(n.bitmap)) {
        _Bitmap.set(key, hex.substring(0, n.length));
        hex = hex.substring(n.length);
      }
    });
    _Bitmap;
    // console.log(_Bitmap)
    return _Bitmap;
  }
}

// let _ = '723A400108818002';
// console.log(_.length);
const XL = new ISO8583({
  header: 'ISO015000017'
});

XL.init([
  ['SECONDARY_BITMAP', { bitmap: 1, length: 16 }],
  ['TRANSMISSION_DATE', { bitmap: 7, length: 10 }],
  ['SYSTEM_TRACE', { bitmap: 11, length: 6 }],
  ['RESPONSE_CODE', { bitmap: 39, length: 2 }],
  ['NETWORK_MANAGEMENT', { bitmap: 70, length: 3 }]
]);

// XL.set('SECONDARY_BITMAP', '400000000000000');
// XL.set('TRANSMISSION_DATE', '0325042644');
// XL.set('SYSTEM_TRACE', '720957');
// XL.set('NETWORK_MANAGEMENT', '301');

// XL.set('CARDHOLDER_STATUS', '12');

/**
 * Wrap message if there any set mmethods
 */

// let XX = XL.wrapMsg();

// XX;
let unp = XL.unpackMsg(
  'ISO0150000170800822000000000000004000000000000000325042644720957301',
  {
    output: 'array'
  }
);

console.log(unp);
