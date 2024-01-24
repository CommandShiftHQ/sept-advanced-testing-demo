const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../src/db");
const { create } = require("../../src/controllers/user");

describe("create", () => {
  beforeEach(() => {
    sinon.restore();
  });
  it("returns a 201 status code", async () => {
    // arrange
    // create function would normally get request and response object from express framework
    // but because we are unit testing we need to supply this and it needs to have the same "shape"
    // as what it would in the function
    const request = { body: { email: "email", password: "password" } };
    const response = {};
    // create fake status method that returns the response so we can chain on .json
    response.status = sinon.stub().returns(response);
    // then setting .json to a spy so can run assertions on it
    response.json = sinon.spy();

    // creating data variable to mimic/fake what would be returned from database
    const data = {
      rows: [
        {
          id: 1,
          email: "email",
          password: "password",
        },
      ],
    };

    // using sinon.stub method, pass it the database object, tell to replace query method on that object (the await db.query() from the controller)
    // then tell it what to return, as it's an async function it needs to return promise which resolves to the data above
    sinon.stub(db, "query").returns(Promise.resolve(data));

    // act
    // invoke create function with everything created above
    await create(request, response);

    // assert
    // using spy set on line 20 to assert the method .status has been called with 201
    expect(response.status.calledWith(201)).to.be.true;
    // using spy set on line 20 to assert the method .json has been called with the correct arguements
    expect(
      response.json.calledWith({
        id: 1,
        email: "email",
        password: "password",
      })
    ).to.be.true;
  });

  it("passes the correct SQL to the db", async () => {
    // arrange
    // same as test above
    const request = { body: { email: "email", password: "password" } };
    const response = {};
    response.status = sinon.stub().returns(response);
    response.json = sinon.stub();

    const data = {
      rows: [
        {
          id: 1,
          email: "email",
          password: "password",
        },
      ],
    };

    // mock combines spy and stub
    const mockDB = sinon
      .mock(db) // mock the db object i.e. automatically replace this object and all of it's methods
      .expects("query") // chain expectations on query method so can see mock is being used as expected
      .once()
      .withArgs(
        "INSERT INTO Users(email, password) VALUES ($1, $2) RETURNING *",
        ["email", "password"]
      )
      .returns(Promise.resolve(data));

    // act
    await create(request, response);

    // assert
    mockDB.verify();
  });
});
