import React, { useEffect, useState } from "react";
import { getUsers, getShiftsByUserId, addShift } from "../network/index";
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
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [starttimeForm, setStarttimeForm] = React.useState("");
  const [endtimeForm, setEndtimeForm] = React.useState("");

  const classes = useStyles();

  const auth = React.useContext(authContext);

  // Store the user ID of employee that is selected
  const loadCurrentShifts = async () => {
    if (selectedUser.length < 1) {
      console.log("No selected user");
      // Output no user selected or similar
      return;
    }

    const response = await getShiftsByUserId(auth.token, selectedUser);
    if (!response) {
      return;
    }
    setShifts(response.data.userShifts);
  };

  const handleAdd = async () => {
    const starttime = new Date(starttimeForm);
    const endtime = new Date(endtimeForm);
    console.log(selectedUser);
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
  };

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

  // Load selected user's shifts
  useEffect(() => {
    (async () => {
      await loadCurrentShifts();
    })();
  }, [selectedUser]);

  const outputShifts = shifts?.map((item) => {
    return (
      <Shift
        key={item.id}
        starttime={item.starttime}
        endtime={item.endtime}
        id={item.id}
        admin
        loadMethods={{
          loadCurrentShifts: loadCurrentShifts,
        }}
      />
    );
  });

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

  return (
    <Grid>
      <Typography variant="h2">Manage Shifts</Typography>
      <Typography variant="h3">Select a user: </Typography>
      <Grid container alignItems="center" justify="space-around">
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
      </Grid>
      {shifts && outputShifts}
      {!shifts && selectedUser.length > 1 ? outputNoShifts : null}
      {/* Edit shift dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        aria-labelledby="add-shift-dialog-title"
        aria-describedby="add-shift-dialog-description"
      >
        <DialogTitle id="add-shift-title">{"Add Shift"}</DialogTitle>
        <DialogContent>
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
      </Dialog>
    </Grid>
  );
}
