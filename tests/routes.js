var
  should = require("should"),
  request = require("supertest"),
  assert = require("assert"),
  app = require("../server"),
  User = require("../app/models/user");

describe("Test routes for index", function() {
  it("Should return OK 200 when making GET /", function(done) {
    request(app)
      .get("/")
      .expect(200, done);
  });
});

describe("Test routes for user", function() {
  after(function() {
    User.remove().exec();
  });

  it("Should register a new user with POST /auth/register", function(done) {
    var user = {
      fullname: "Test Test",
      email: "user@internet.com",
      password: "abc123"
    };

    request(app)
      .post("/auth/register")
      .set('Accept', 'application/json')
      .send(user)
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if(err) {
          throw err;
        }

        res.body.should.have.property("registered");
        done();
      });
  });
});
