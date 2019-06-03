const ISO8583 = require('..')
const expect = require('chai').expect

describe("ISO8583 Unwrap message", ()=>{

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

  it("Should return valid bitmap", ()=>{
    const UnWrapMsg = X.unWrapMsg('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')
    expect(UnWrapMsg.get(1)).to.equal('0000004000000000')
    expect(UnWrapMsg.get(2)).to.equal('160000912478128124')
    expect(UnWrapMsg.get(3)).to.equal('561999')
    expect(UnWrapMsg.get(4)).to.equal('000000025000')
    expect(UnWrapMsg.get(7)).to.equal('0323163555') 
  }) 
})