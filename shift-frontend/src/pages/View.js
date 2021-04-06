import React, { useEffect } from "react";
import { getCurrentShifts } from "../network/index";
import authContext from "../context/authContext";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

export default function View() {
  const [shifts, setShifts] = React.useState(null);
  const auth = React.useContext(authContext);

  const getShifts = async () => {
    const response = await getCurrentShifts(auth.token);

    if (!response) {
      console.error("View.js: Error getting shifts - no response");
      return;
    }
    if (!response.status === 200) {
      console.error("View.js: Error getting shifts");
      return;
    }
    // Transform to be used in events
    const allEvents = response.data.userShifts.map((item) => {
      console.log(item);
      return {
        title: "Shift",
        start: new Date(item.starttime),
        end: new Date(item.endtime),
      };
    });
    setShifts(allEvents);
  };

  // Network call: retrieve user's shifts
  useEffect(() => {
    (async () => {
      await getShifts();
    })();
  }, [auth.token]);

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const MyCalendar = (
    <Calendar
      localizer={localizer}
      events={shifts}
      scrollToTime={new Date(1970, 1, 1, 6)}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      step={60}
    />
  );

  return (
    <>
      <h1>My Schedule</h1>
      {shifts && MyCalendar}
    </>
  );
}
