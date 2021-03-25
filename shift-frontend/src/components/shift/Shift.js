import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { deleteShift } from "../../network/index";
import authContext from "../../context/authContext";
import CustomDialog from "../global/CustomDialog";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
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
});
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    console.log(id);
    // Perform backend delete function
    const response = await deleteShift(auth.token, id);
    if (!response) {
      throw new Error("Shift.js: Could not delete shift");
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
        <Grid container justify="space-between" className={classes.root}>
          <Grid>
            <h3>{shiftDate.toDateString()}</h3>
            <h4>{`${timeStart} - ${timeEnd}`}</h4>
          </Grid>
          <Grid>
            <IconButton
              aria-label="delete"
              color="primary"
              classes={{
                colorPrimary: classes.iconColor,
              }}
              onClick={handleClickOpen}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
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
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleClose();
                handleDelete();
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
