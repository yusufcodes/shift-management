import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

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
}) {
  const classes = useStyles();

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
            onClick={() => console.log("delete shift of ID: " + id)}
          >
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container justify="space-between" className={classes.root}>
      <Grid>
        <h3>{shiftDate.toDateString()}</h3>
        <h4>{`${timeStart} - ${timeEnd}`}</h4>
      </Grid>
    </Grid>
  );
}
