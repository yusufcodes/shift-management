const request = require("supertest");
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

  it("responds with a 404 error due to invalid shift id being passed in", (done, res) => {
    request(app)
      .get("/api/shift/id/39483")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });

  it("responds with json containing an array of Shift objects, for the given user ID", (done, res) => {
    request(app)
      .get("/api/shift/user/60588ead8d1e500da43fb515")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("returns a 404 error due to invalid user ID being passed in", (done, res) => {
    request(app)
      .get("/api/shift/user/3994492")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });

  let token;

  // Perform login with existing user to store valid token
  // This is to be used when testing authenticated routes
  beforeEach((done) => {
    request(app)
      .post("/api/user/login")
      .send({
        email: "mark123@gmail.com",
        password: "password1234",
      })
      .end(function (err, res) {
        if (err) throw err;
        token = res.body.token;
        done();
      });
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

  it("responds with 401 when getting current users shifts without auth token", (done, res) => {
    request(app)
      .get("/api/shift/current")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401, done);
  });

  let newShiftId;

  // === Authenticated Routes: Admin ===
  // Create Shift: valid inputs
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

  // Create Shift: invalid user ID supplied
  it("responds with a 404 when trying to create a new shift with an incorrect user id", (done, res) => {
    const currentDate = new Date();
    request(app)
      .post("/api/shift/")
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
        endtime: currentDate,
        employeeId: "3333",
      })
      .expect("Content-Type", /json/)
      .expect(404, done);
  });

  // Create Shift: missing body information
  it("responds with a 422 when trying to create a new shift with a missing data field", (done, res) => {
    const currentDate = new Date();
    request(app)
      .post("/api/shift/")
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
        employeeId: "60588ead8d1e500da43fb515",
      })
      .expect("Content-Type", /json/)
      .expect(422, done);
  });

  // Update Shift: successful updating of a shift
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

  // Update Shift: invalid shift ID
  it(`return a 404 error when updating shift with invalid ID`, (done, res) => {
    const currentDate = new Date();
    request(app)
      .patch(`/api/shift/6085fb573712661894f5e883`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
        endtime: currentDate,
      })
      .expect("Content-Type", /json/)
      .expect(404, done);
  });

  // Update Shift: invalid input
  it(`return a 422 error when updating shift with invalid input (missing endtime to shift)`, (done, res) => {
    const currentDate = new Date();
    request(app)
      .patch(`/api/shift/6085fb573712661894f5e883`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .send({
        starttime: currentDate,
      })
      .expect("Content-Type", /json/)
      .expect(422, done);
  });

  // Delete Shift: successfully delete shift
  it(`Delete the shift with ID passed in and return OK status`, (done, res) => {
    request(app)
      .delete(`/api/shift/${newShiftId}`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  // Delete Shift: invalid shift ID
  it(`Delete the shift with ID passed in and return OK status`, (done, res) => {
    request(app)
      .delete(`/api/shift/6085fb573712661894f5e883`)
      .set("Accept", "application/json")
      .set("X-Authorization", token)
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});
