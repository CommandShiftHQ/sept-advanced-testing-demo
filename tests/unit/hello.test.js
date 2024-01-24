const { expect } = require("chai");
const sinon = require("sinon");
const { hello } = require("../../src/controllers/hello");

describe("hello", () => {
  it("returns hello world", () => {
    // arrange
    // the hello function would normally get request and response object from express framework
    // but because we are unit testing we need to supply this and it needs to have the same "shape"
    // as what it would in the function
    const request = {};
     // set a spy on the send method to "watch" if the method is called and with what arguements
    const response = { send: sinon.spy() };

    // act
    // invoke the hello function passing in the request and response
    hello(request, response);

    // assertions
    // check send method is called once
    expect(response.send.calledOnce).to.be.true;
     // check send is called with arguement "Hello World!!!!!!!!"
    expect(response.send.calledWith("Hello World!!!!!!!!")).to.be.true;
  });
});
