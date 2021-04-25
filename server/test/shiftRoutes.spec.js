const request = require("supertest");
const should = require("should");
const app = require("../app");
const { expect } = require("chai");

// ============== Shift Router Tests =================

/* Notes 
describe: coming from Mocha, grouping test cases
it: alias for test, sued to write individual test cases.
set: HTTP headers
expect: check return values, header and body
check that the status is 200, and then end the test by calling the done callback.
*/
describe("=== Shift Router Tests ===", () => {
  let token;

  // Perform login with existing user to store valid token
  // This is to be used when testing authenticated routes
  before((done) => {
    request(app)
      .post("/api/user/login")
      .send({
        email: "mark123@gmail.com",
        password: "password123",
      })
      .end(function (err, res) {
        if (err) throw err;
        token = res.body.token;
        done();
      });
  });

  // === Unauthenticated Routes ===
  it("responds with json containing all of the shifts", (done, res) => {
    request(app)
      .get("/api/shift/all")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("responds with json containing details of one shift based on id", (done, res) => {
    request(app)
      .get("/api/shift/id/605f8d10ff4c112b41e669f5")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("responds with json containing an array of Shift objects, for the given user ID", (done, res) => {
    request(app)
      .get("/api/shift/user/60588ead8d1e500da43fb515")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  // === Authenticated Routes: Non Admin ===
  it("responds with json containing an array of Shift objects, based on token (auth)", (done, res) => {
    request(app)
      .get("/api/shift/current")
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  let newShiftId;

  // === Authenticated Routes: Admin ===
  // Create Shift
  it("responds with json containing new shift, starting and ending at the same time, for user with ID 60588ead8d1e500da43fb515", (done, res) => {
    const currentDate = new Date();
    request(app)
      .post("/api/shift/")
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
        endtime: currentDate,
        employeeId: "60588ead8d1e500da43fb515",
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        newShiftId = res.body.shift["_id"];
        expect(res.body.shift["employeeId"]).to.equal(
          "60588ead8d1e500da43fb515"
        );
        done();
      });
  });

  // Update Shift
  it(`Update the shift with ID passed in and return a JSON with updated shift details`, (done, res) => {
    const currentDate = new Date();
    request(app)
      .patch(`/api/shift/${newShiftId}`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
        endtime: currentDate,
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.shift["_id"]).to.equal(newShiftId);
        done();
      });
  });

  // Delete Shift
  it(`Delete the shift with ID passed in and return OK status`, (done, res) => {
    request(app)
      .delete(`/api/shift/${newShiftId}`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
