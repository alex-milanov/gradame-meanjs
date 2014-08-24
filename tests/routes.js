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
  var user = {
    fullname: "Test Test",
    email: "user@internet.com",
    password: "abc123"
  };

  afterEach(function() {
    User.remove().exec();
  });

  it("Should register a new user with POST /auth/register", function(done) {
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

  it("Should fail on login with invalid user", function(done) {
    request(app)
      .post("/auth/login")
      .set('Accept', 'application/json')
      .send(user)
      .expect(401, done);
  });

  it("Should succeed on login with a valid user", function(done) {
    request(app)
      .post("/auth/register")
      .set('Accept', 'application/json')
      .send(user)
      .end(function(err, res) {
        request(app)
          .post("/auth/login")
          .set('Accept', 'application/json')
          .send(user)
          .expect(200)
          .end(function(err, res) {
            console.log(res.body);
            // res.body.user.should.be.equal(user);
            done();
          });
      });
  });


  it("Should fail on loging out an invalid user", function(done) {
    request(app)
      .get("/auth/logout")
      .set('Accept', 'application/json')
      .expect(401)
      .end(function(err, res) {
        console.log(err);
        console.log(res.body);
        done();
      });
  });

  it("Should log out user that has already been logged in", function(done) {
    var token = "";

    request(app)
      .post("/auth/register")
      .set('Accept', 'application/json')
      .send(user)
      .end(function(err, res) {
        request(app)
          .post("/auth/login")
          .set('Accept', 'application/json')
          .send(user)
          .expect(200)
          .end(function(err, res) {

            token = res.body.token;

            request(app)
              .get("/auth/logout")
              .set('Accept', 'application/json')
              .set("token", token)
              .expect(200)
              .end(function(err, res) {
                if(err) {
                  throw err;
                }

                res.body.should.have.property("message", "logged out");

                done();
              });
          });
      });
  });
});
