var
  should = require("should"),
  request = require("supertest"),
  app = require("../server");

describe("Test routes", function() {
  it("Should return OK 200 when making  GET /", function(done) {
    request(app)
      .get("/")
      .expect(200, done);
  });
});
