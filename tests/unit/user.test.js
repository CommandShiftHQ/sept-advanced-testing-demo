const { expect } = require("chai");
const sinon = require("sinon");
const db = require("../../src/db");
const { create } = require("../../src/controllers/user");

describe("create", () => {
  beforeEach(() => {
    sinon.restore()
  })
  it("returns a 201 status code", async () => {
    // arrange
    const request = { body: { email: "email", password: "password" } };
    const response = {};
    response.status = sinon.stub().returns(response);
    response.json = sinon.spy();
    const data = {
      rows: [
        {
          id: 1,
          email: "email",
          password: "password",
        },
      ],
    };
    sinon.stub(db, "query").returns(Promise.resolve(data));

    // act
    await create(request, response);

    expect(response.status.calledWith(201)).to.be.true;
    expect(
      response.json.calledWith({
        id: 1,
        email: "email",
        password: "password",
      })
    ).to.be.true;
  });

  it("passes the correct SQL to the db", async () => {
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

    const mockDB = sinon
      .mock(db) // mock all of db
      .expects("query") // mock query method
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
