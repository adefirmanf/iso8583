const ISO8583 = require('..');

const FOO = new ISO8583({
  header: 'ISO015000017'
});

FOO.init([
  ['SECONDARY_BITMAP', { bitmap: 1, length: 16 }],
  ['PRIMARY_ACCOUNT_NUMBER', { bitmap: 2, length: 18 }],
  ['PROCESSING_CODE', { bitmap: 3, length: 6 }],
  ['TRANSACTION_AMOUNT', { bitmap: 4, length: 12 }],
  ['TRANSMISSION_DATETIME', { bitmap: 7, length: 10 }],
  ['SYSTEM_TRACE', { bitmap: 11, length: 6 }],
  ['LOCAL_TIME', { bitmap: 12, length: 6 }],
  ['LOCAL_DATE', { bitmap: 13, length: 4 }],
  ['SETTLEMENT_DATE', { bitmap: 15, length: 4 }],
  ['MERCHANT_TYPE', { bitmap: 18, length: 4 }]
]);

FOO.set('PRIMARY_ACCOUNT_NUMBER', '160000000000002208');
FOO.set('PROCESSING_CODE', '573000');
FOO.set('TRANSACTION_AMOUNT', '000001000000');
FOO.set('TRANSMISSION_DATETIME', '0325112843');
FOO.set('SYSTEM_TRACE', '720954');
FOO.set('LOCAL_TIME', '112843');
FOO.set('LOCAL_DATE', '0325');
FOO.set('SETTLEMENT_DATE', '0325');

let __ = FOO.wrapMsg();
console.log(__);
