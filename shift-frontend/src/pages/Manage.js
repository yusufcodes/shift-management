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
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import authContext from "../context/authContext";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
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
  const [allUsers, setAllUsers] = useState(null);
  const [allShifts, setAllShifts] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState(null);

  // Add shift: start and end
  const [starttimeForm, setStarttimeForm] = React.useState("");
  const [endtimeForm, setEndtimeForm] = React.useState("");

  // Edit shift: start and end
  const [startEdit, setStartEdit] = React.useState(null);
  const [endEdit, setEndEdit] = React.useState(null);

  // Dialog state
  const [openAddCalendarDialog, setOpenAddCalendarDialog] = React.useState(
    false
  );
  const [openEditCalendarDialog, setOpenEditCalendarDialog] = React.useState(
    false
  );
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [editDialogName, setEditDialogName] = React.useState(null);

  const classes = useStyles();
  const auth = React.useContext(authContext);

  const loadAllShifts = async () => {
    const response = await getAllShifts(auth.token);
    if (!response) {
      return;
    }
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

    loadAllShifts();
  };

  const handleEdit = async () => {
    const starttime = new Date(startEdit);
    const endtime = new Date(endEdit);
    const response = await updateShift(
      auth.token,
      selectedShiftId,
      starttime,
      endtime
    );
    if (!response) {
      throw new Error("Manage.js - handleAdd: Could not edit shift");
    }

    loadAllShifts();
  };

  const handleDelete = async () => {
    const response = await deleteShift(auth.token, selectedShiftId);
    if (!response) {
      throw new Error("Shift.js - handleDelete: Could not delete shift");
    }

    loadAllShifts();
  };

  // Load all users when selecting who to create a shift for
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
                onClick={async () => {
                  setOpenAddCalendarDialog(false);
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
        {/* Date Time Picker */}
        <form className={classes.container} noValidate>
          <TextField
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
            id="datetime-end"
            label="End Time"
            type="datetime-local"
            defaultValue={endEdit}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => setEndEdit(event.target.value)}
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
          <DialogActions>
            <Button
              onClick={() => setOpenEditCalendarDialog(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setOpenEditCalendarDialog(false);
                await handleEdit();
              }}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </form>
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
        <DialogContent>
          <DialogContentText id="delete-shift-description">
            Are you sure you want to delete this shift?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setOpenDeleteDialog(false);
              setOpenEditCalendarDialog(false);
              await handleDelete();
            }}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
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
      onSelectEvent={(event, e) => {
        const { shiftId, title, start, end } = event;

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
      style={{ height: 500 }}
      step={60}
    />
  );

  return (
    <>
      <Grid>
        <Typography variant="h4">Manage Shifts</Typography>
        {allShifts && MyCalendar}
        {AddShiftCalendar}
        {EditShiftCalendar}
        {DeleteShiftDialog}
      </Grid>
    </>
  );
}
