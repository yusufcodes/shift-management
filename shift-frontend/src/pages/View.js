import React, { useEffect, useState } from "react";
import { getCurrentShifts } from "../network/index";
import authContext from "../context/authContext";
import Shift from "../components/shift/Shift";
import { Button, ButtonGroup } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export default function View() {
  const [shifts, setShifts] = React.useState(null);
  const auth = React.useContext(authContext);

  const [dateRange, setDateRange] = React.useState("month");

  const handleChange = (event) => {
    setDateRange(event.target.value);
  };

  const getShifts = async (month = false, week = false) => {
    let response;

    if (month) {
      response = await getCurrentShifts(auth.token, true, false);
    } else if (week) {
      response = await getCurrentShifts(auth.token, false, true);
    } else {
      response = await getCurrentShifts(auth.token);
    }

    if (!response) {
      console.error("View.js: Error getting shifts");
      return;
    }
    if (!response.status === 200) {
      console.error("View.js: Error getting shifts");
      return;
    }
    setShifts(response.data.userShifts);
  };

  // Network call: retrieve user's shifts
  useEffect(() => {
    (async () => {
      await getShifts();
    })();
  }, [auth.token]);

  // Date range option changed: alter network request
  useEffect(() => {
    (async () => {
      if (dateRange === "month") {
        await getShifts(true, false);
      } else if (dateRange === "week") {
        await getShifts(false, true);
      } else {
        await getShifts();
      }
    })();
  }, [dateRange]);

  if (!shifts) {
    return <h1>No shifts to display yet :(</h1>;
  } else {
    const outputShifts = shifts.map(({ starttime, endtime }) => (
      <Shift starttime={starttime} endtime={endtime} />
    ));

    const outputDateRange = () => {
      Date.prototype.GetFirstDayOfWeek = function () {
        return new Date(
          this.setDate(
            this.getDate() - this.getDay() + (this.getDay() == 0 ? -6 : 1)
          )
        );
      };

      Date.prototype.GetLastDayOfWeek = function () {
        return new Date(this.setDate(this.getDate() - this.getDay() + 7));
      };

      const date = new Date();

      if (dateRange === "week") {
        return (
          <h3>
            {date.GetFirstDayOfWeek().toLocaleDateString()} -{" "}
            {date.GetLastDayOfWeek().toLocaleDateString()}
          </h3>
        );
      } else if (dateRange === "month") {
        return (
          <h3>
            {new Date(1, date.getMonth()).toLocaleString("default", {
              month: "long",
            })}
          </h3>
        );
      }
    };

    return (
      <>
        <h1>My Schedule</h1>
        {outputDateRange()}
        <FormControl component="fieldset">
          <FormLabel component="legend">Shift Range</FormLabel>
          <RadioGroup
            aria-label="date-range"
            name="date-range"
            value={dateRange}
            onChange={handleChange}
          >
            <FormControlLabel
              value="week"
              control={<Radio />}
              label="This Week"
            />
            <FormControlLabel
              value="month"
              control={<Radio />}
              label="This Month"
            />

            <FormControlLabel
              value="All"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            />
          </RadioGroup>
        </FormControl>
        {/* <ButtonGroup
          variant="contained"
          color="primary"
          aria-label="contained primary button group"
        >
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup> */}
        {outputShifts}
      </>
    );
  }
}
