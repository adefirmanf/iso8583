/**
 *
 * Created by Ade Firman F - 2019
 */
const { bitmapToHex, flagActiveBit, hexToBinary, dataElements } = require('./lib/index');
class ISO8583 {
  constructor(opts = {}) {
    const {header = '', elementName = false, mti = true} = opts
    /**
     * Define variable
     */
    this._header = header
    this._elementType = elementName
    this._type = mti
    /**
     * Set a value
     */
    const Element = elementName ? dataElements.NAME : dataElements.BIT
    this._temp = new Map([...Element])
    
    // this._opts = opts;
    this._msg;
    // this._elements = dataElements
    this._value = new Map([]);
    // if(opts) {
    //   const {header = '', mti = true} = opts
    //   this._header = header;
    //   this._type = mti
    // }
  }
  init(params) {
    this._temp.clear()
    this._temp = new Map(params);
  }
  static value(data) {}
  set(name, value, _opts = {}) {
    let f
    if (!this._temp.get(name)){
      f = new ReferenceError(`'${name}' is not defined in initialization.`)
      throw f
    }
    let { length, bitmap } = this._temp.get(name);

    // console.log(Object.keys(_opts).indexOf("length"))
    if(Object.keys(_opts).indexOf("length") !== -1){
      this._temp.set(name, {bitmap, length : _opts.length})
      length = _opts.length
    }
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

    f = this._value.set(name, { ...this._temp.get(name), value });
    return f
  }
  get(name, value) {}
  wrapMsg(mti = '', opts) {
    /**
     * Define the MTI with name as key
     */
    const MTIBit = new Map([
      ['AUTHORIZATION_REQUEST', '0100' ],
      ['AUTHORIZATION_RESPONSE', '0110'],
      ['AUTHORIZATION_ADVICE', '0120'],
      ['AUTHORIZATION_ADVICE_REPEAT', '0121'],
      ['ISSUER_RESPONSE_TO_AUTHORIZATION_ADVICE', '0130'],
      ['ACQUIRER_FINANCIAL_REQUEST', '0200'],
      ['ISSUER_RESPONSE_TO_FINANCIAL_REQUEST', '0210'],
      ['ACQUIRER_FINANCIAL_ADVICE', '0220'],
      ['ACQUIRER_FINANCIAL_ADVICE_REPEAT', '0221'],
      ['CONFIRMATION_OF_RECEIPT_OF_FINANCIAL_ADVICE', '0230'],
      ['BATCH_UPLOAD', '0320'],
      ['BATCH_UPLOAD_RESPONSE', '0330'],
      ['ACQUIRER_REVERSAL_REQUEST', '0400'],
      ['ACQUIRER_REVERSAL_ADVICE', '0420'],
      ['ACQUIRER_REVERSAL_ADVICE_RESPONSE', '0430'],
      ['BATCH_SETTLEMENT_RESPONSE', '0510'],
      ['NETWORK_MANAGEMENT_REQUEST', '0800'],
      ['NETWORK_MANAGEMENT_RESPONSE', '0810'],
      ['NETWORK_MANAGEMENT_ADVICE', '0820']
    ])

    mti = MTIBit.get(mti) || mti

    this._string = '';
    let bitmap = [];
    let total_length = 0;

    for (let [key, v] of this._value) {
      if (v.length) {
        total_length += v.length;
        this._string = this._string.concat(v.value);        
      } else {
        let lenVariable = String(v.variableLength).length;
        let size = String(v.value).length;
        let value = Number(v.variableLength);
        if (size > value) {
          throw `The message size '${size}' is larger than the parameterized size '${v.variableLength}'`;
        }        
        total_length += size + lenVariable;
        this._string = this._string.concat(((size < value) ? String(size).padStart(lenVariable, '0') : String(size)) + v.value);        
      }
      bitmap.push(v.bitmap);
    }

    let hex = (this._value.entries().next().value.map(x => x.bitmap)[1] > 4 ? '0' : '') + bitmapToHex(bitmap).substring(0, 16);
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
    /**
     * Define the MTI with BIT as key
     */
    const MTIName = new Map([
      ['0100', 'AUTHORIZATION_REQUEST' ],
      ['0110', 'AUTHORIZATION_RESPONSE'],
      ['0120', 'AUTHORIZATION_ADVICE'],
      ['0121', 'AUTHORIZATION_ADVICE_REPEAT'],
      ['0130', 'ISSUER_RESPONSE_TO_AUTHORIZATION_ADVICE'],
      ['0200', 'ACQUIRER_FINANCIAL_REQUEST'],
      ['0210', 'ISSUER_RESPONSE_TO_FINANCIAL_REQUEST'],
      ['0220', 'ACQUIRER_FINANCIAL_ADVICE'],
      ['0221', 'ACQUIRER_FINANCIAL_ADVICE_REPEAT'],
      ['0230', 'CONFIRMATION_OF_RECEIPT_OF_FINANCIAL_ADVICE'],
      ['0320', 'BATCH_UPLOAD'],
      ['0330', 'BATCH_UPLOAD_RESPONSE'],
      ['0400', 'ACQUIRER_REVERSAL_REQUEST'],
      ['0420', 'ACQUIRER_REVERSAL_ADVICE'],
      ['0430', 'ACQUIRER_REVERSAL_ADVICE_RESPONSE'],
      ['0510', 'BATCH_SETTLEMENT_RESPONSE'],
      ['0800', 'NETWORK_MANAGEMENT_REQUEST'],
      ['0810', 'NETWORK_MANAGEMENT_RESPONSE'],
      ['0820', 'NETWORK_MANAGEMENT_ADVICE'],
    ])
    
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
    _Bitmap.set('TYPE_NAME', MTIName.get(_Bitmap.get('TYPE')))

    hex = hex.substring(16, hex.length + 16);

    for (let [key, value] of this._temp) {
      if (_Bitmap.has(value.bitmap)) {
        let v;
        let size;
        if (value.length) {
          v = hex.substring(0, value.length);
          size = value.length;
        } else {          
          let lenVariable = String(value.variableLength).length;
          size = Number(hex.substring(0, lenVariable));
          if (size > Number(value.variableLength)) {
            throw `The message size '${size}' is larger than the parameterized size '${value.variableLength}'`;
          }
          v = hex.substring(lenVariable, size + lenVariable);
          size += lenVariable;
        }
        _Bitmap.set(value.bitmap, v);
        _Bitmap.set(key, v);
        hex = hex.substring(size);
      }
    }
    return _Bitmap;
  }
}

module.exports = ISO8583;
