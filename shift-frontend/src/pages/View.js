import React, { useEffect, useState } from "react";
import { getCurrentShifts } from "../network/index";
import authContext from "../context/authContext";
import Shift from "../components/shift/Shift";

export default function View() {
  const [shifts, setShifts] = React.useState(null);
  const auth = React.useContext(authContext);

  useEffect(() => {
    (async () => {
      const response = await getCurrentShifts(auth.token);
      if (!response) {
        console.error("View.js: Error getting shifts");
        return;
      }
      if (!response.status === 200) {
        console.error("View.js: Error getting shifts");
        return;
      }
      setShifts(response.data.userShifts);
    })();
  }, []);

  if (!shifts) {
    return <h1>No shifts to display yet :(</h1>;
  } else {
    const outputShifts = shifts.map(({ starttime, endtime }) => (
      <Shift starttime={starttime} endtime={endtime} />
    ));
    return (
      <>
        <h1>My Schedule</h1>
        {outputShifts}
      </>
    );
  }
}
