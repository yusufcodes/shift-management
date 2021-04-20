import React, { useEffect } from "react";
import { getCurrentShifts } from "../network/index";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import getUserData from "../utils/getUserData";
import {
  Document,
  Page,
  Text,
  View as PDFView,
  PDFDownloadLink,
  StyleSheet,
} from "@react-pdf/renderer";
import { FolderOpenOutlined } from "@material-ui/icons";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  shift: {},
});

export default function View() {
  const [shifts, setShifts] = React.useState(null);
  const [shiftsPDF, setShiftsPDF] = React.useState(null);

  useEffect(() => {
    console.log("UseEffect: Running...");
    (async () => {
      // Check that the user is logged in
      const userData = getUserData();
      if (!userData) {
        console.log("View: Not logged in");
        window.location.replace(`http://${window.location.host}/login`);
        return;
      }
      // Get user's shifts
      const response = await getShifts();
    })();
  }, []);

  const getShifts = async () => {
    const userData = getUserData();
    if (!userData) {
      console.error("NOT LOGGED IN?");
    }
    const response = await getCurrentShifts(userData.token);

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
      return {
        title: "Shift",
        start: new Date(item.starttime),
        end: new Date(item.endtime),
      };
    });

    // Transform to be used in PDF export
    const sortedShifts = new Map();

    response.data.userShifts.map((item) => {
      // Setup new Map

      // Get current month
      const month = new Date(item.starttime).toLocaleString("default", {
        month: "long",
      });

      // If the current month is NOT an entry
      if (!sortedShifts.get(month)) {
        sortedShifts.set(month, [{ item }]);
      } else {
        const old = sortedShifts.get(month);
        sortedShifts.set(month, [...old, { item }]);
      }

      return sortedShifts;
    });

    setShifts(allEvents);
    setShiftsPDF(sortedShifts);
  };

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

  const producePDF = () => {
    console.log("Producing PDF...");
    if (!shiftsPDF) {
      console.error("producePDF: shiftsPDF does not exist, returning,...");
      return;
    } else {
      console.info("producePDF: shiftsPDF DOES exist, running...");
    }

    // Code
    const arrayOfShifts = [...shiftsPDF];

    const PDF = arrayOfShifts.map((item, index) => {
      const monthHeading = item[0];

      const monthShifts = item[1].map(({ item }, index) => {
        const { starttime, endtime } = item;
        const start = new Date(starttime);
        const end = new Date(endtime);

        // Convert to regular day
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

        const day = start.toLocaleDateString(undefined, options);

        // Get times
        const timeStart = start.toLocaleTimeString();
        const timeEnd = end.toLocaleTimeString();

        // Return PDF JSX element to represent date/time
        return (
          <PDFView>
            <Text>{day}</Text>
            <Text>
              {timeStart} - {timeEnd}
            </Text>
          </PDFView>
        );
      });

      return (
        <Page size="A4" style={styles.page}>
          <PDFView>
            <Text>{monthHeading}</Text>
            {monthShifts}
          </PDFView>
        </Page>
      );
    });

    return PDF;
  };

  const ShiftsPDF = () => <Document>{producePDF()}</Document>;
  // const ShiftsPDF = () => <Document></Document>;

  return (
    <>
      <h1>My Schedule</h1>
      {shifts && MyCalendar}
      {/* <PDFDownloadLink document={<ShiftsPDF />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink> */}
      {shiftsPDF && (
        <PDFDownloadLink document={<ShiftsPDF />} fileName="somename.pdf">
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      )}
    </>
  );
}
