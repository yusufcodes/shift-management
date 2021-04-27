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
import { Button, makeStyles, Typography } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Snackbar from "../components/global/Snackbar";
import { Font } from "@react-pdf/renderer";

Font.registerEmojiSource({
  format: "png",
  url: "https://twemoji.maxcdn.com/2/72x72/",
});

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

// Create styles for PDF VIEW
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
  heading: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  shift: {
    borderWidth: 2,
    borderRadius: 3,
    borderColor: "grey",
    padding: 5,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#4a4e69",
    color: "#f2f2f2",
  },
});

export default function View({ testEvents = null }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "80%",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "15px 0",
    },
  }));

  const classes = useStyles();

  const [shifts, setShifts] = React.useState(null);
  const [shiftsPDF, setShiftsPDF] = React.useState(null);
  const [loggedInName, setLoggedInName] = React.useState("");
  const [error, setError] = React.useState(false);

  useEffect(() => {
    // getShifts no longer called if in test mode
    if (testEvents) {
      setShifts(testEvents);
      return;
    }
    (async () => {
      // Check that the user is logged in
      const userData = getUserData();
      console.log(userData);
      if (!userData) {
        console.log("View: Not logged in");
        window.location.replace(`http://${window.location.host}/login`);
        return;
      }
      let { name } = userData;
      name = name.replace(/ /g, "_");
      setLoggedInName(name);
      // Get user's shifts
      await getShifts();
    })();
  }, []);

  const getShifts = async () => {
    console.log("Running getShifts...");
    // setError(false);
    const userData = getUserData();
    if (!userData) {
      console.error("NOT LOGGED IN?");
    }
    const response = await getCurrentShifts(userData.token);

    if (!response) {
      setError(true);
      console.error("View.js: Error getting shifts - no response");
      return;
    }
    if (!response.status === 200) {
      setError(true);
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
      style={{ height: 700 }}
      step={60}
    />
  );

  const producePDF = () => {
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
          <PDFView style={styles.shift}>
            <Text>📅 {day}</Text>
            <Text>
              ⏰ {timeStart.slice(0, 5)} - {timeEnd.slice(0, 5)}
            </Text>
          </PDFView>
        );
      });

      return (
        <Page size="A4" style={styles.page}>
          <PDFView>
            <Text style={styles.heading}>{monthHeading}</Text>
            {monthShifts}
          </PDFView>
        </Page>
      );
    });

    return PDF;
  };

  const ShiftsPDF = () => <Document>{producePDF()}</Document>;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h1>My Schedule</h1>

        {shiftsPDF && (
          <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
            <PDFDownloadLink
              document={<ShiftsPDF />}
              fileName={`${loggedInName}_Shifts.pdf`}
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading Shifts..." : "Export Shifts"
              }
            </PDFDownloadLink>
          </Button>
        )}
      </div>
      <Typography variant="h5">{`👋🏼 Welcome ${loggedInName.replace(
        /_/g,
        " "
      )}, here is your schedule`}</Typography>
      {shifts && MyCalendar}
      <Snackbar
        open={error}
        onClose={() => setError(false)}
        message="There was an error loading your schedule - please try again"
        type="error"
      />
    </div>
  );
}
