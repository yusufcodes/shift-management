import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Grid, TextField, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteShift, updateShift } from "../../network/index";
import authContext from "../../context/authContext";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#4a4e69",
    border: "1px solid #c7c7c7",
    color: "#f2f2f2",
    width: "250px",
    padding: "5px",
    margin: "10px",
  },
  iconColor: {
    color: "#f2f2f2",
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
}));
// TODO: Pass in flag from backend to allow for shift element to be clickable by an admin
export default function Shift({
  starttime,
  endtime,
  id = null,
  admin = false,
  loadMethods = null,
}) {
  const auth = React.useContext(authContext);
  const classes = useStyles();

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  // Open / close shift dialog
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const [starttimeForm, setStarttimeForm] = React.useState(
    starttime.slice(0, 16)
  );
  const [endtimeForm, setEndtimeForm] = React.useState(endtime.slice(0, 16));

  const handleClickOpenDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    console.log(id);
    // Perform backend delete function
    const response = await deleteShift(auth.token, id);
    if (!response) {
      throw new Error("Shift.js - handleDelete: Could not delete shift");
    }

    loadMethods?.loadCurrentShifts();
  };

  const handleEdit = async () => {
    const starttime = new Date(starttimeForm);
    const endtime = new Date(endtimeForm);
    const response = await updateShift(auth.token, id, starttime, endtime);
    if (!response) {
      throw new Error("Shift.js - handleEdit: Could not edit shift");
    }

    loadMethods?.loadCurrentShifts();
  };

  const shiftDate = new Date(starttime);
  const timeStart = shiftDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const shiftDateEnd = new Date(endtime);
  const timeEnd = shiftDateEnd.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (admin) {
    return (
      <>
        <Grid
          container
          justify="space-between"
          direction="row"
          className={classes.root}
        >
          <Grid item>
            <Typography variant="h5">{shiftDate.toDateString()}</Typography>
            <Typography variant="h6">{`${timeStart} - ${timeEnd}`}</Typography>
          </Grid>

          <Grid item>
            <Grid>
              <IconButton
                aria-label="edit"
                color="primary"
                classes={{
                  colorPrimary: classes.iconColor,
                }}
                onClick={() => setOpenEditDialog(true)}
              >
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid>
              <IconButton
                aria-label="delete"
                color="primary"
                classes={{
                  colorPrimary: classes.iconColor,
                }}
                onClick={handleClickOpenDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

        {/* Delete shift dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDelete}
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
            <Button onClick={handleCloseDelete} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleCloseDelete();
                handleDelete();
              }}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit shift dialog */}
        <Dialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          aria-labelledby="edit-shift-dialog-title"
          aria-describedby="edit-shift-dialog-description"
        >
          <DialogTitle id="edit-shift-title">{"Edit Shift"}</DialogTitle>
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
            <Button onClick={() => setOpenEditDialog(false)} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenEditDialog(false);
                handleEdit();
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
  }

  return (
    <>
      <Grid container justify="space-between" className={classes.root}>
        <Grid>
          <h3>{shiftDate.toDateString()}</h3>
          <h4>{`${timeStart} - ${timeEnd}`}</h4>
        </Grid>
      </Grid>
    </>
  );
}
