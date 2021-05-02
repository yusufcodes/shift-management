import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getUsers,
  addShift,
  updateShift,
  getAllShifts,
  deleteShift,
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
  DialogContentText,
  DialogTitle,
  makeStyles,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import getUserData from "../utils/getUserData";
import moment from "moment";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "../components/global/Snackbar";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: "0 auto",
  },
  header: {
    margin: "20px 0",
  },

  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  error: {
    color: "red",
  },
  progress: {
    textAlign: "center",
  },
}));
/* 
Manage page
Allow for an admin to: create, update & delete shifts
Ability to view entire team's working shifts.
*/
export default function Manage() {
  // Page state
  const [userData, setUserData] = useState(null);
  const [addSuccess, setAddSuccess] = useState({
    open: false,
    message: "Success - shift has been added",
  });
  const [editSuccess, setEditSuccess] = useState({
    open: false,
    message: "Success - shift has been edited",
  });
  const [deleteSuccess, setDeleteSuccess] = useState({
    open: false,
    message: "Success - shift has been deleted",
  });
  const [error, setError] = useState(false);

  // Redirect user back to login if they are not logged in
  const checkLogin = () => {
    const userData = getUserData();
    if (!userData) {
      console.log("Manage: NOT LOGGED IN - REDIRECT");
      window.location.replace(`http://${window.location.host}/login`);
      return;
    }
    if (!userData.isAdmin) {
      console.log("Manage: User is not an admin - Redirect to view");
      window.location.replace(`http://${window.location.host}/dashboard/view`);
    }
    setUserData(userData);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [allUsers, setAllUsers] = useState(null);
  const [allShifts, setAllShifts] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  // Add shift: start and end
  const [starttimeForm, setStarttimeForm] = useState("");
  const [endtimeForm, setEndtimeForm] = useState("");

  // Edit shift: start and end
  const [startEdit, setStartEdit] = useState(null);
  const [endEdit, setEndEdit] = useState(null);

  // Dialog state
  const [openAddCalendarDialog, setOpenAddCalendarDialog] = useState(false);
  const [addIsLoading, setAddIsLoading] = useState(false);

  const [openEditCalendarDialog, setOpenEditCalendarDialog] = useState(false);
  const [editIsLoading, setEditIsLoading] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const [editDialogName, setEditDialogName] = useState(null);

  const [dayError, setDayError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [lengthError, setLengthError] = useState(false);

  const classes = useStyles();

  const resetSnackbarStates = () => {
    setAddSuccess((prevState) => ({
      ...prevState,
      open: false,
    }));
    setEditSuccess((prevState) => ({
      ...prevState,
      open: false,
    }));
    setDeleteSuccess((prevState) => ({
      ...prevState,
      open: false,
    }));
    setError(false);
  };

  const loadAllShifts = async () => {
    checkLogin();
    // Retrieve all user shifts from backend
    const response = await getAllShifts(userData?.token);
    // Error handling
    if (!response) {
      setError(true);
      return;
    }
    if (response.status !== 200) {
      setError(true);
      return;
    }
    // Restructure backend data to be implemented into the calendar
    const allEvents = response.data.allShifts.map((item) => {
      return {
        shiftId: item.id,
        title: item.name,
        start: new Date(item.start),
        end: new Date(item.end),
      };
    });
    setAllShifts(allEvents);
  };

  // Input error handling on dates - when editing a shift.
  const checkDates = (start, end) => {
    setInputError(false);
    setTimeError(false);
    setDayError(false);

    // Invalid date state
    if (
      !(start instanceof Date && !isNaN(start)) ||
      !(end instanceof Date && !isNaN(end))
    ) {
      setInputError(true);
      return true;
    }

    const startDay = start.toISOString().split("T")[0];
    const endDay = end.toISOString().split("T")[0];

    const startTime = parseInt(start.toISOString().split("T")[1], 10);
    const endTime = parseInt(end.toISOString().split("T")[1], 10);

    const hourDifference = endTime - startTime;

    // Check that start begins before the end - works
    if (!(start < end)) {
      console.log("checkDates: Start date is later than end date");
      setTimeError(true);
      return true;
    }

    // Check that the dates are on the same day - works
    if (!(startDay === endDay)) {
      setDayError(true);
      return true;
    }

    // Check that shift is not longer than 10 hours
    if (hourDifference > 10) {
      setLengthError(true);
      return true;
    }

    // No errors: return false
    return false;
  };

  // Perform adding of a new shift - backend communication
  const handleAdd = async () => {
    setAddIsLoading(true);
    // Check user is logged in & reset state
    checkLogin();
    resetSnackbarStates();

    // Create Date objects from start and end date selected by user
    const starttime = new Date(starttimeForm);
    const endtime = new Date(endtimeForm);

    // Perform backend request to create shift
    const response = await addShift(
      userData?.token,
      selectedUser,
      starttime,
      endtime
    );

    // Set error snackbar to visible if there are errors
    if (!response) {
      setError(true);
      setAddIsLoading(false);

      return;
    }
    if (response.status !== 201) {
      setError(true);
      setAddIsLoading(false);

      return;
    }

    // Close create dialog and reload all shifts, to output new shift
    setAddIsLoading(false);
    setOpenAddCalendarDialog(false);
    loadAllShifts();
    setAddSuccess((prevState) => ({
      ...prevState,
      open: true,
    }));
  };

  // Perform editing of a shift - backend communication
  const handleEdit = async () => {
    setEditIsLoading(true);
    checkLogin();
    resetSnackbarStates();
    const starttime = new Date(startEdit);
    const endtime = new Date(endEdit);
    const errors = checkDates(starttime, endtime);
    if (errors) {
      setEditIsLoading(false);
      return false;
    }

    // Proceed if there are no errors
    const response = await updateShift(
      userData?.token,
      selectedShiftId,
      starttime,
      endtime
    );
    if (!response) {
      setError(true);
      setEditIsLoading(false);

      return;
    }
    if (response.status !== 200) {
      setError(true);
      setEditIsLoading(false);

      return;
    }

    loadAllShifts();
    setEditSuccess((prevState) => ({
      ...prevState,
      open: true,
    }));
    setEditIsLoading(false);
    return true;
  };

  // Perform deletion of a shift - backend communication
  const handleDelete = async () => {
    setDeleteIsLoading(true);
    checkLogin();
    resetSnackbarStates();
    const response = await deleteShift(userData?.token, selectedShiftId);
    if (!response) {
      setError(true);
      setDeleteIsLoading(false);

      return;
    }
    if (response.status !== 200) {
      setError(true);
      setDeleteIsLoading(false);

      return;
    }

    setDeleteSuccess((prevState) => ({
      ...prevState,
      open: true,
    }));
    setDeleteIsLoading(false);
    setOpenDeleteDialog(false);
    setOpenEditCalendarDialog(false);

    loadAllShifts();
  };

  // Load all users when selecting who to create a shift for
  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (!response) {
        setError(true);
        return;
      }
      if (response.status !== 200) {
        setError(true);
        return;
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

  // Load all shifts from backend
  useEffect(() => {
    (async () => {
      await loadAllShifts();
    })();
  }, []);

  const AddShiftCalendar = (
    <Dialog
      open={openAddCalendarDialog}
      onClose={() => setOpenAddCalendarDialog(false)}
      aria-labelledby="add-shift-dialog-title"
      aria-describedby="add-shift-dialog-description"
    >
      <DialogTitle id="add-shift-title">{"Add Shift"}</DialogTitle>

      <DialogContent>
        {addIsLoading ? (
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <DialogContentText>
              Select an employee to create this new shift for:
            </DialogContentText>
            <FormControl>
              <InputLabel htmlFor="employee-select">Employee</InputLabel>
              <Select
                native
                value={selectedUser}
                onChange={(event) => {
                  setSelectedUser(event.target.value);
                }}
                inputProps={{
                  name: "employee",
                  id: "employee-select",
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
                    onClick={async () => {
                      await handleAdd();
                    }}
                    color="primary"
                    autoFocus
                  >
                    OK
                  </Button>
                </DialogActions>
              </>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  const EditShiftCalendar = (
    <Dialog
      open={openEditCalendarDialog}
      onClose={() => setOpenEditCalendarDialog(false)}
      aria-labelledby="edit-shift-dialog-title"
      aria-describedby="edit-shift-dialog-description"
    >
      <DialogTitle id="edit-shift-title">{`Edit Shift - ${editDialogName}`}</DialogTitle>
      <DialogContent>
        {editIsLoading ? (
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        ) : (
          <form className={classes.container} noValidate>
            <TextField
              required
              id="datetime-start"
              label="Start Time"
              type="datetime-local"
              defaultValue={startEdit}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setStartEdit(event.target.value)}
            />
            <TextField
              required
              id="datetime-end"
              label="End Time"
              type="datetime-local"
              defaultValue={endEdit}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setEndEdit(event.target.value);
              }}
            />
            <IconButton
              aria-label="delete"
              color="primary"
              classes={{
                colorPrimary: classes.iconColor,
              }}
              onClick={() => setOpenDeleteDialog(true)}
            >
              <DeleteIcon />
            </IconButton>
            {timeError && (
              <Typography className={classes.error}>
                Shift start time must be smaller than the end time
              </Typography>
            )}
            {dayError && (
              <Typography className={classes.error}>
                Shift must start and end on the same day
              </Typography>
            )}
            {inputError && (
              <Typography className={classes.error}>
                Invalid date(s) entered, please try again
              </Typography>
            )}
            {lengthError && (
              <Typography className={classes.error}>
                Shift should not exceed 10 hours
              </Typography>
            )}
            <DialogActions>
              <Button
                onClick={() => setOpenEditCalendarDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  const performEdit = await handleEdit();
                  if (performEdit) {
                    setOpenEditCalendarDialog(false);
                  }
                }}
                color="primary"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );

  const DeleteShiftDialog = (
    <>
      {/* Delete shift dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-shift-dialog-title"
        aria-describedby="delete-shift-dialog-description"
      >
        <DialogTitle id="delete-shift-title">
          {"Delete this shift?"}
        </DialogTitle>
        {deleteIsLoading ? (
          <div className={classes.progress}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <DialogContent>
              <DialogContentText id="delete-shift-description">
                Are you sure you want to delete this shift?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleDelete();
                }}
                color="primary"
                autoFocus
              >
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );

  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const MyCalendar = (
    <Calendar
      selectable
      onSelectSlot={({ start, end }) => {
        setSelectedUser(null);
        setStarttimeForm(start);
        setEndtimeForm(end);
        setOpenAddCalendarDialog(true);
      }}
      onSelectEvent={(event) => {
        const { shiftId, title, start, end } = event;
        setInputError(false);
        setTimeError(false);
        setDayError(false);
        setLengthError(false);
        setEditDialogName(title);
        setSelectedShiftId(shiftId);
        setStartEdit(moment(new Date(start)).format("YYYY-MM-DDTkk:mm"));
        setEndEdit(moment(new Date(end)).format("YYYY-MM-DDTkk:mm"));
        setOpenEditCalendarDialog(true);
      }}
      localizer={localizer}
      events={allShifts}
      scrollToTime={new Date(1970, 1, 1, 6)}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 700 }}
      step={60}
    />
  );

  return (
    <Grid className={classes.root}>
      <h1 className={classes.header}>Manage Shifts</h1>
      <Alert
        severity="info"
        style={{
          margin: "10px 0",
        }}
      >
        Use the calendar interface below to add, edit or remove shifts.
      </Alert>
      {allShifts && MyCalendar}
      {AddShiftCalendar}
      {EditShiftCalendar}
      {DeleteShiftDialog}
      <Snackbar
        open={addSuccess.open}
        onClose={() =>
          setAddSuccess((prevState) => ({
            ...prevState,
            open: false,
          }))
        }
        message={addSuccess.message}
        type="success"
      />
      <Snackbar
        open={editSuccess.open}
        onClose={() =>
          setEditSuccess((prevState) => ({
            ...prevState,
            open: false,
          }))
        }
        message={editSuccess.message}
        type="success"
      />
      <Snackbar
        open={deleteSuccess.open}
        onClose={() =>
          setDeleteSuccess((prevState) => ({
            ...prevState,
            open: false,
          }))
        }
        message={deleteSuccess.message}
        type="success"
      />
      <Snackbar
        open={error}
        onClose={() => setError(false)}
        message="Error performing action - please try again"
        type="error"
      />
    </Grid>
  );
}
