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
import Alert from "@material-ui/lab/Alert";
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

// Styles for PDF (not page)
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

/*
Page: View
Purpose:
- Output shift schedule for the user currently logged in, into a calendar
- Option to export the shifts to a PDF
*/
export default function View() {
  // Page Styles
  const useStyles = makeStyles(() => ({
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

  // Page state - used for conditional rendering of page content
  const [shifts, setShifts] = React.useState(null);
  const [shiftsPDF, setShiftsPDF] = React.useState(null);
  const [loggedInName, setLoggedInName] = React.useState("");
  const [error, setError] = React.useState(false);

  useEffect(() => {
    (async () => {
      // Check that the user is logged in
      const userData = getUserData();
      if (!userData) {
        // Redirect user to login page if they are not logged in
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
    // Retrieve user data stored in local storage
    const userData = getUserData();
    if (!userData) {
      setError(true);
      console.error("NOT LOGGED IN");
      return;
    }

    // Perform backend call passing in token
    const response = await getCurrentShifts(userData.token);

    // Error handling
    if (!response) {
      return;
    }
    if (!response.status === 200) {
      setError(true);
      console.error("View.js: Error getting shifts");
      return;
    }

    // Transform shifts from backend to match the format for React Big Calendar
    const allEvents = response.data.userShifts.map((item) => {
      return {
        title: "Shift",
        start: new Date(item.starttime),
        end: new Date(item.endtime),
      };
    });

    // Transforming shifts from backend to be used in PDF generation
    const sortedShifts = new Map();

    response.data.userShifts.map((item) => {
      // Get current month
      const month = new Date(item.starttime).toLocaleString("default", {
        month: "long",
      });

      // If the current month is NOT an entry
      if (!sortedShifts.get(month)) {
        // Create new entry in the 'sortedShifts' for current month
        sortedShifts.set(month, [{ item }]);
      } else {
        // Add a new entry to 'sortedShifts' for existing month
        const old = sortedShifts.get(month);
        sortedShifts.set(month, [...old, { item }]);
      }

      return sortedShifts;
    });

    setShifts(allEvents); // Store shifts for React Big Calendar
    setShiftsPDF(sortedShifts); // Store shifts for PDF generation
  };

  // Calendar date initialisation
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

  // producePDF: Method to return components to build up PDF of shifts
  const producePDF = () => {
    // Convert from Map to Array
    const arrayOfShifts = [...shiftsPDF];

    // Iterate over 'arrayOfShifts' to generate PDF output
    const PDF = arrayOfShifts.map((item, index) => {
      // Extract current month
      const monthHeading = item[0];

      // Extract each shift linked to the current month in the iteration
      const monthShifts = item[1].map(({ item }, index) => {
        // Extract starttime and endtime
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
            {/* monthShifts: return the components generated for the current month being generated */}
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
      {shifts ? (
        MyCalendar
      ) : (
        <Alert
          severity="info"
          style={{
            margin: "20px 0",
          }}
        >
          There are no schedule shifts for you at the moment, please check back
          later.
        </Alert>
      )}
      <Snackbar
        open={error}
        onClose={() => setError(false)}
        message="There was an error loading your schedule - please try again"
        type="error"
      />
    </div>
  );
}
