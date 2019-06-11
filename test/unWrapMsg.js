const ISO8583 = require('..')
const expect = require('chai').expect

describe("ISO8583 Unwrap message", ()=>{

  const X = new ISO8583({
    header : 'ISO015000017',
    mti : true
  })

  it("Should return valid bitmap", ()=>{
    const UnWrapMsg = X.unWrapMsg('ISO0150000170800f20000000000000000000040000000001600009124781281245619990000000250000323163555')
    expect(UnWrapMsg.get(1)).to.equal('0000004000000000')
    expect(UnWrapMsg.get(2)).to.equal('160000912478128124')
    expect(UnWrapMsg.get(3)).to.equal('561999')
    expect(UnWrapMsg.get(4)).to.equal('000000025000')
    expect(UnWrapMsg.get(7)).to.equal('0323163555') 
  }) 
})