const { expect } = require('chai')
const sinon = require('sinon')
const { hello } = require('../../src/controllers/hello');

describe('hello', () => {
  it('returns hello world', () => {
    // arrange
    const request = {}
    const response = { send: sinon.spy() }
    
    // act
    hello(request, response)
    
    // assertions
    expect(response.send.calledOnce).to.be.true
    expect(response.send.calledWith("Hello World!!!!!!!!")).to.be.true
  })
})