const request = require("supertest");
const should = require("should");
const app = require("../app");
const { expect } = require("chai");

// ============== User Router Tests =================
describe("=== User Router Tests ===", () => {
  // Get All Users
  it("returns a json with all signed up users", (done, res) => {
    request(app)
      .get("/api/user/")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  // Perform sign up
  it("create a new user account and return the user details", (done, res) => {
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

  // Perform login
  it("perform login to existing account and return user details", (done, res) => {
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
});
