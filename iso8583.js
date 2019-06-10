/**
 *
 * Created by Ade Firman F - 2019
 */
const { bitmapToHex, flagActiveBit, hexToBinary, dataElements } = require('./lib/index');
class ISO8583 {
  constructor(opts) {
    this._opts = opts;
    this._msg;
    this._elements = dataElements
    // this._temp = new Map(this._elements)
    this._value = new Map([]);
    if(opts) {
      const {header = '', mti = true} = opts
      this._header = header;
      this._type = mti
    }
  }
  init(params) {
    this._mapElements = new Map(this._elements)
    let mapParams = new Map([...params])
    mapParams.forEach((v, k)=>{
      this._mapElements.set(k, v)
    });

    this._temp = new Map([...this._mapElements]);
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

      return this._value.set(name, { ...this._temp.get(name), value });
    }
  }
  get(name, value) {}
  wrapMsg(mti = '', opts) {
    this._string = '';
    let bitmap = [];
    let total_length = 0;

    this._value.forEach(n => {
      total_length = total_length + n.length;
      this._string = this._string.concat(n.value);
      bitmap.push(n.bitmap);
    });

    let hex = bitmapToHex(bitmap).substring(0, 16);
    let arr = new Array(16).fill(0, 0, 16);
    hex = hex
      .split('')
      .concat(arr)
      .slice(0, -hex.length)
      .join('');

    this._value.set('PRIMARY_BITMAP', {
      name: 'PRIMARY_BITMAP',
      bitmap: false,
      value: hex.substring(0, 16)
    });

    this._string = hex + this._string;
    return this._header + mti + this._string;
  }

  unWrapMsg(hex, opts = {output : 'array'}) {
    const { output = 'array', validate = false } = opts;
    
    let _Temp_Bitmap = new Map([
      ['TYPE', 'NOT GIVEN VALUE']
    ])
    
    /**
     * Set a type
     */
    if(this._type){

    this._type = hex.substring(
      this._header.length,
      parseInt(this._header.length + 4)
    );

    _Temp_Bitmap.set('TYPE', this._type);
    /**
     * Substring the message based on header + (4 = Message type)
     */
    hex = hex.substring(parseInt(this._header.length + 4));
    
    }
    /**
     * Storage for saving a bitmap
     */
    let _Bitmap
    /**
     * Convert hexToBinary
     */
    let binary = hexToBinary(hex);
    /**
     * Calling the library
     */
    _Bitmap = flagActiveBit(binary);

    /**
     * Set as Primary Bitmap
     */

    _Bitmap.set('PRIMARY_BITMAP', hex.substring(0, 16));
    _Bitmap.set('TYPE', _Temp_Bitmap.get('TYPE'))

    hex = hex.substring(16, hex.length + 16);

    let init = 0;
    this._temp.forEach((n, key, index) => {
      if (_Bitmap.has(n.bitmap)) {
        let v = hex.substring(0, n.length);
        _Bitmap.set(n.bitmap, v);
        _Bitmap.set(key, v);
        hex = hex.substring(n.length);
      }
    });
    return _Bitmap;
  }
}

module.exports = ISO8583;
