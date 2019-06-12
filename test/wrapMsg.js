const ISO8583 = require('..')
const expect = require('chai').expect

describe("ISO8583 Wrap message", ()=>{
  it("Should return valid message with element name set to true", ()=>{
    const X = new ISO8583({
      elementName : true,
      header : 'ISO015000017',
      mti : true
    })
  
    X.set('SECONDARY_BITMAP', '0000004000000000')
    X.set('PRIMARY_ACCOUNT_NUMBER', '160000912478128124')
    X.set('PROCESSING_CODE', '561999')
    X.set('AMOUNT_TRANSACTION', '25000')
    X.set('TRANSACTION_DATETIME', '0323163555')

    expect(X.wrapMsg('0800')).to.equal('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')

  })

  it("Should return valid message with element name set to false", ()=>{
    const X = new ISO8583({
      elementName : false,
      header : 'ISO015000017',
      mti : true
    })
  
    X.set(1, '0000004000000000')
    X.set(2, '160000912478128124')
    X.set(3, '561999')
    X.set(4, '25000')
    X.set(7, '0323163555')

    expect(X.wrapMsg('0800')).to.equal('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')

  })

  it("Should return valid message with initialization", ()=>{
    const X = new ISO8583({
      header : 'ISO015000017',
      mti : true
    })
    X.init([
      ['SECONDARY', {bitmap : 1, length : 16}],
      ['ACCOUNT', {bitmap : 2, length : 18}],
      ['PROCESSING', {bitmap : 3, length : 6}],
      ['AMOUNT', {bitmap : 4, length : 12}],
      ['DATETIME', {bitmap : 7, length : 10}]
    ])
    
    X.set('SECONDARY', '0000004000000000')
    X.set('ACCOUNT', '160000912478128124')
    X.set('PROCESSING', '561999')
    X.set('AMOUNT', '25000')
    X.set('DATETIME', '0323163555')

    expect(X.wrapMsg('0800')).to.equal('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')

  })
})