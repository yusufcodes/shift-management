const ShiftRouter = require("./routes/shift-routes");
const request = require("supertest");
const express = require("express");
const { deleteOne } = require("./models/user");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", ShiftRouter);

request(app)
  .get("/user/604fb4305bf6502f78a54b2d")
  .expect("Content-Type", /json/)
  .expect({
    userShifts: [
      {
        _id: "604fb4c85bf6502f78a54b2e",
        datetime: "2021-03-15T19:26:00.568Z",
        employeeId: "604fb4305bf6502f78a54b2d",
        __v: 0,
        id: "604fb4c85bf6502f78a54b2e",
      },
    ],
  })
  .expect(200)
  .end(function (err, res) {
    if (err) {
       )
    }
  });

// test("Get shift by user ID works", (done) => {
//   request(app)
//     .get("/user/604fb4305bf6502f78a54b2d")
//     .expect("Content-Type", /json/)
//     .expect({
//       userShifts: [
//         {
//           _id: "604fb4c85bf6502f78a54b2e",
//           datetime: "2021-03-15T19:26:00.568Z",
//           employeeId: "604fb4305bf6502f78a54b2d",
//           __v: 0,
//           id: "604fb4c85bf6502f78a54b2e",
//         },
//       ],
//     })
//     .expect(200, done);
// });
