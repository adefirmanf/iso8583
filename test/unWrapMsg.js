const ISO8583 = require('..')
const expect = require('chai').expect

describe("ISO8583 Unwrap message", ()=>{

  it("Should return valid bitmap with element name set to true", ()=>{
    const X = new ISO8583({
      elementName : true,
      header : 'ISO015000017',
      mti : true
    })

    const UnWrapMsg = X.unWrapMsg('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')
    expect(UnWrapMsg.get('SECONDARY_BITMAP')).to.equal('0000004000000000')
    expect(UnWrapMsg.get('PRIMARY_ACCOUNT_NUMBER')).to.equal('160000912478128124')
    expect(UnWrapMsg.get('PROCESSING_CODE')).to.equal('561999')
    expect(UnWrapMsg.get('AMOUNT_TRANSACTION')).to.equal('000000025000')
    expect(UnWrapMsg.get('TRANSACTION_DATETIME')).to.equal('0323163555') 
  })

  it("Should return valid bitmap with element name set to false", ()=>{
    const X = new ISO8583({
      elementName : true,
      header : 'ISO015000017',
      mti : true
    })
    
    const UnWrapMsg = X.unWrapMsg('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')
    expect(UnWrapMsg.get(1)).to.equal('0000004000000000')
    expect(UnWrapMsg.get(2)).to.equal('160000912478128124')
    expect(UnWrapMsg.get(3)).to.equal('561999')
    expect(UnWrapMsg.get(4)).to.equal('000000025000')
    expect(UnWrapMsg.get(7)).to.equal('0323163555') 
  })

  it("Should return valid bitmap with initialization", ()=>{

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

    const UnWrapMsg = X.unWrapMsg('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')
    expect(UnWrapMsg.get('SECONDARY')).to.equal('0000004000000000')
    expect(UnWrapMsg.get('ACCOUNT')).to.equal('160000912478128124')
    expect(UnWrapMsg.get('PROCESSING')).to.equal('561999')
    expect(UnWrapMsg.get('AMOUNT')).to.equal('000000025000')
    expect(UnWrapMsg.get('DATETIME')).to.equal('0323163555') 
  })
})