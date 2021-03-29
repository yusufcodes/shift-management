import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getUsers,
  getShiftsByUserId,
  addShift,
  getAllShifts,
} from "../network/index";
import InputLabel from "@material-ui/core/InputLabel";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import authContext from "../context/authContext";
import Shift from "../components/shift/Shift";
import AddBoxIcon from "@material-ui/icons/AddBox";

// Calendar stuff
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function Manage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [shifts, setShifts] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [starttimeForm, setStarttimeForm] = React.useState("");
  const [endtimeForm, setEndtimeForm] = React.useState("");
  const [allShifts, setAllShifts] = useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const [openAddCalendarDialog, setOpenAddCalendarDialog] = React.useState(
    false
  );

  const classes = useStyles();
  const auth = React.useContext(authContext);

  // Store the user ID of employee that is selected
  const loadCurrentShifts = async () => {
    if (selectedUser?.length < 1) {
      console.log("No selected user");
      // Output no user selected or similar
      return;
    }

    // todo: error handling
    const response = await getShiftsByUserId(auth.token, selectedUser);
    if (!response) {
      return;
    }
    setShifts(response.data.userShifts);
  };

  const loadAllShifts = async () => {
    const response = await getAllShifts(auth.token);
    if (!response) {
      return;
    }
    const allEvents = response.data.allShifts.map((item) => {
      return {
        title: item.name,
        start: new Date(item.start),
        end: new Date(item.end),
      };
    });
    setAllShifts(allEvents);
  };

  const handleAdd = async () => {
    const starttime = new Date(starttimeForm);
    const endtime = new Date(endtimeForm);
    const response = await addShift(
      auth.token,
      selectedUser,
      starttime,
      endtime
    );
    if (!response) {
      throw new Error("Manage.js - handleAdd: Could not add new shift");
    }

    loadCurrentShifts();
    loadAllShifts();
  };

  // Load all users
  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (!response || response.status !== 200) {
        throw new Error("Manage.js: Could not get all users");
      }
      const userOptions = response.data.users.map((item) => {
        return (
          <option value={item.id} key={item.id}>
            {item.name}
          </option>
        );
      });
      setAllUsers(userOptions);
    })();
  }, []);

  // Load all shifts
  useEffect(() => {
    (async () => {
      await loadAllShifts();
    })();
  }, []);

  // Load selected user's shifts
  useEffect(() => {
    (async () => {
      await loadCurrentShifts();
    })();
  }, [selectedUser]);

  useEffect(() => {
    console.log("All Shifts Loaded:");
    console.log(allShifts);
  }, [allShifts]);

  const outputAddShiftButton = (
    <Grid>
      <Button
        variant="contained"
        onClick={() => setOpenAddDialog(true)}
        color="primary"
        startIcon={<AddBoxIcon />}
      >
        Add Shift
      </Button>
    </Grid>
  );

  const outputNoShifts = <p>No shifts for this user</p>;

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  /*
  1. Get ALL shifts - write backend method for this:

  2. Store in state

  3. Once this exists, do the following with the data:

  */

  const AddShiftCalendar = (
    <Dialog
      open={openAddCalendarDialog}
      onClose={() => setOpenAddCalendarDialog(false)}
      aria-labelledby="add-shift-dialog-title"
      aria-describedby="add-shift-dialog-description"
    >
      <DialogTitle id="add-shift-title">{"Add Shift"}</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel htmlFor="age-select">Employee</InputLabel>
          <Select
            native
            value={selectedUser}
            onChange={(event) => {
              setSelectedUser(event.target.value);
            }}
            inputProps={{
              name: "employee",
              id: "age-select",
            }}
          >
            <option aria-label="None" value="" />
            {allUsers}
          </Select>
        </FormControl>
        {selectedUser ? (
          <>
            <p>Would you like to confirm this shift for this user?</p>
            <p>{`${starttimeForm
              .toLocaleTimeString()
              .slice(0, 5)} - ${endtimeForm
              .toLocaleTimeString()
              .slice(0, 5)}`}</p>
            <DialogActions>
              <Button
                onClick={() => setOpenAddCalendarDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOpenAddCalendarDialog(false);
                  handleAdd();
                  console.log("perform add shift here");
                }}
                color="primary"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );

  const MyCalendar = (
    // onSelectEvent: (event: Object, e: SyntheticEvent) => any
    // onSelecting - Time view: (range: { start: Date, end: Date }) => ?boolean
    // selected
    <Calendar
      selectable
      // onSelecting={({ start, end }) => {
      //   console.log(start);
      //   console.log(end);
      //   /*
      // - Set start and end times
      // - Open modal to add the shift
      // - On submit: reload all shifts
      // */
      //   setSelectedStartDate(start);
      //   setSelectedEndDate(end);
      // }}
      onSelectSlot={({ start, end }) => {
        // setSelectedStartDate(start);
        // setSelectedEndDate(end);
        setSelectedUser(null);

        setStarttimeForm(start);
        setEndtimeForm(end);
        // Open confirmation dialog:
        setOpenAddCalendarDialog(true);
        // Select user
        // Confirm shift for the currently selected user?
      }}
      localizer={localizer}
      events={allShifts}
      scrollToTime={new Date(1970, 1, 1, 6)}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      step={60}
    />
  );

  return (
    <>
      <Grid>
        <Typography variant="h4">Manage Shifts</Typography>
        {allShifts && MyCalendar}
        {/* Add shift from calendar dialog */}
        {AddShiftCalendar}
      </Grid>

      {/* Old Code Below */}

      {/* <Typography variant="h3">Select a user: </Typography> */}
      {/* Dropdown: select employee */}
      {/* <Grid container alignItems="center" justify="space-around">
        <Grid>
          <FormControl>
            <InputLabel htmlFor="age-select">Employee</InputLabel>
            <Select
              native
              value={selectedUser}
              onChange={(event) => {
                setShifts(null);
                setSelectedUser(event.target.value);
              }}
              inputProps={{
                name: "employee",
                id: "age-select",
              }}
            >
              <option aria-label="None" value="" />
              {allUsers}
            </Select>
          </FormControl>
        </Grid>
        {shifts && outputAddShiftButton}
      </Grid> */}
      {/* {shifts && outputShifts} */}
      {/* {!shifts && selectedUser?.length > 1 ? outputNoShifts : null} */}

      {/* Add shift dialog */}
      {/* <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        aria-labelledby="add-shift-dialog-title"
        aria-describedby="add-shift-dialog-description"
      >
        <DialogTitle id="add-shift-title">{"Add Shift"}</DialogTitle>
        <DialogContent>
          <FormControl>
            <InputLabel htmlFor="age-select">Employee</InputLabel>
            <Select
              native
              value={selectedUser}
              onChange={(event) => {
                setSelectedUser(event.target.value);
              }}
              inputProps={{
                name: "employee",
                id: "age-select",
              }}
            >
              <option aria-label="None" value="" />
              {allUsers}
            </Select>
          </FormControl>
          <form className={classes.container} noValidate>
            <TextField
              id="datetime-start"
              label="Start Time"
              type="datetime-local"
              defaultValue={starttimeForm}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setStarttimeForm(event.target.value)}
            />
            <TextField
              id="datetime-end"
              label="End Time"
              type="datetime-local"
              defaultValue={endtimeForm}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setEndtimeForm(event.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenAddDialog(false);
              handleAdd();
            }}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}
