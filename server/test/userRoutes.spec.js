const request = require("supertest");
const app = require("../app");
const { expect } = require("chai");

// todo: make sure all tests make sense

// ============== User Router Tests =================
describe("=== User Router Tests ===", () => {
  // Get All Users
  describe("ROUTE: /api/user", () => {
    it("[GET]: returns a json with all signed up users", (done, res) => {
      request(app)
        .get("/api/user/")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200, done);
    });
  });

  // Sign Up
  describe("ROUTE: /api/user/signup", () => {
    // success: create account with no issues
    // TODO: change email to create a new  user when re-running test
    it("[POST]: create a new user account and return the user details [* should fail right now]", (done, res) => {
      const testEmail = "testuser@gmail.com";

      request(app)
        .post("/api/user/signup")
        .set("Accept", "application/json")
        .send({
          name: "Test Person",
          email: "testuser@gmail.com",
          admin: false,
          password: "password123",
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.email).to.equal(testEmail);
          done();
        });
    });

    // fail: user aready exists
    it("[POST] - return 422 error when trying to create a user with an existing email address", (done, res) => {
      request(app)
        .post("/api/user/signup")
        .set("Accept", "application/json")
        .send({
          name: "Test Person",
          email: "testuser@gmail.com",
          admin: false,
          password: "password123",
        })
        .expect("Content-Type", /json/)
        .expect(422, done);
    });

    // fail: empty body parameter (no name)
    it("[POST] - return 422 error when trying to create a user with no name", (done, res) => {
      const testEmail = "testuser@gmail.com";

      request(app)
        .post("/api/user/signup")
        .set("Accept", "application/json")
        .send({
          email: "testuser@gmail.com",
          admin: false,
          password: "password123",
        })
        .expect("Content-Type", /json/)
        .expect(422, done);
    });

    // fail: invalid email
    it("[POST] - return 422 error when trying to create a user with an invalid email address", (done, res) => {
      const testEmail = "testuser@gmail.com";

      request(app)
        .post("/api/user/signup")
        .set("Accept", "application/json")
        .send({
          name: "test name",
          email: "testuser",
          admin: false,
          password: "password123",
        })
        .expect("Content-Type", /json/)
        .expect(422, done);
    });

    // invalid - password less than 6 chars
    it("[POST] - return 422 error when trying to create a user with a password less than 6 characters", (done, res) => {
      const testEmail = "testuser@gmail.com";

      request(app)
        .post("/api/user/signup")
        .set("Accept", "application/json")
        .send({
          name: "Test Person",
          email: "testuser@gmail.com",
          admin: false,
          password: "pass",
        })
        .expect("Content-Type", /json/)
        .expect(422, done);
    });
  });

  // Login
  describe("ROUTE: /api/user/login", () => {
    // success: login with correct details
    it("[POST] - perform login to existing account and return user details", (done, res) => {
      const testEmail = "testuser@gmail.com";
      const testPassword = "password123";

      request(app)
        .post("/api/user/login")
        .set("Accept", "application/json")
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect("Content-Type", /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.email).to.equal(testEmail);
          done();
        });
    });

    // fail - missing body info (email)
    it("[POST] - return 422 error when trying to login without sending an email", (done, res) => {
      const testEmail = "testuser@gmail.com";
      const testPassword = "password123";

      request(app)
        .post("/api/user/login")
        .set("Accept", "application/json")
        .send({
          password: testPassword,
        })
        .expect("Content-Type", /json/)
        .expect(422, done);
    });

    // fail - return 401 error when trying to login with incorrect email address
    it("[POST] - return 401 when performing login with incorrect email address", (done, res) => {
      const testEmail = "testuser123456@gmail.com";
      const testPassword = "password123";

      request(app)
        .post("/api/user/login")
        .set("Accept", "application/json")
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect("Content-Type", /json/)
        .expect(401, done);
    });

    // fail - return 401 error when trying to login with incorrect password
    it("[POST] - return 401 when performing login with incorrect password", (done, res) => {
      const testEmail = "testuser123@gmail.com";
      const testPassword = "password12343773";

      request(app)
        .post("/api/user/login")
        .set("Accept", "application/json")
        .send({
          email: testEmail,
          password: testPassword,
        })
        .expect("Content-Type", /json/)
        .expect(401, done);
    });
  });

  // Updating User Details
  describe("ROUTE: /api/user/update/:uid", () => {
    // Get and store token for protected routes
    let token;
    beforeEach((done) => {
      request(app)
        .post("/api/user/login")
        .send({
          email: "testuser@gmail.com",
          password: "password123",
        })
        .end(function (err, res) {
          if (err) throw err;
          token = res.body.token;
          done();
        });
    });

    // success - update user email
    it("[PATCH] - updates user email and returns a 201 [*should fail right now]", (done, res) => {
      request(app)
        .patch("/api/user/update/60862ac77c529b1fe7bc83c3")
        .send({
          email: "testuser@gmail.com",
        })
        .set("Accept", "application/json")
        .set("X-Authorization", token)
        .expect("Content-Type", /json/)
        .expect(201, done);
    });
    // success - update user password
    it("[PATCH] - updates user password and returns a 201", (done, res) => {
      request(app)
        .patch("/api/user/update/60862ac77c529b1fe7bc83c3")
        .send({
          email: "testuser123@gmail.com",
          password: "password123",
        })
        .set("Accept", "application/json")
        .set("X-Authorization", token)
        .expect("Content-Type", /json/)
        .expect(201, done);
    });
    // update user: invalid email -> 422
    it("[PATCH] - return 422 error when updating details with an invalid email address", (done, res) => {
      request(app)
        .patch("/api/user/update/60862ac77c529b1fe7bc83c3")
        .send({
          email: "invalidEmailHere",
        })
        .set("Accept", "application/json")
        .set("X-Authorization", token)
        .expect("Content-Type", /json/)
        .expect(422, done);
    });
    // update user: no inputs -> 422
    it("[PATCH] - return 422 error when updating details without passing in required details (empty object sent)", (done, res) => {
      request(app)
        .patch("/api/user/update/60862ac77c529b1fe7bc83c3")
        .send({})
        .set("Accept", "application/json")
        .set("X-Authorization", token)
        .expect("Content-Type", /json/)
        .expect(422, done);
    });
  });
});
