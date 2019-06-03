const ISO8583 = require('..')
const expect = require('chai').expect

describe("ISO8583 Wrap message", ()=>{

  const X = new ISO8583({
    header : 'ISO015000017',
    mti : true
  })

  X.init([
    ['SECONDARY_BITMAP', {bitmap : 1, length : 16}],
    ['PRIMARY_ACCOUNT_NUMBER', {bitmap : 2, length : 18}],
    ['PROCESSING_CODE', {bitmap : 3, length : 6}],
    ['TRANSACTION_AMOUNT', {bitmap : 4, length : 12}],
    ['DATE_TIME', {bitmap : 7, length : 10}]
  ])

  it("Should return valid message", ()=>{
    X.set('SECONDARY_BITMAP', '0000004000000000')
    X.set('PRIMARY_ACCOUNT_NUMBER', '160000912478128124')
    X.set('PROCESSING_CODE', '561999')
    X.set('TRANSACTION_AMOUNT', '25000')
    X.set('DATE_TIME', '0323163555')

    expect(X.wrapMsg('0800')).to.equal('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')

  })
})