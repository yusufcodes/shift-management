const request = require("supertest");
const app = require("../app");

// ============== Shift Router Tests =================

// === Unauthenticated Routes ===
/* Notes 
describe: coming from Mocha, grouping test cases
it: alias for test, sued to write individual test cases.
set: HTTP headers
expect: check return values, header and body
check that the status is 200, and then end the test by calling the done callback.
*/
describe("GET /all", () => {
  it("responds with json containing all of the shifts", (done, res) => {
    request(app)
      .get("/api/shift/all")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
