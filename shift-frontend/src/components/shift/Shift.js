import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#4a4e69",
    border: "1px solid #c7c7c7",
    color: "#f2f2f2",
    width: "250px",
    padding: "5px",
    margin: "10px",
  },
});

export default function Shift({ starttime, endtime }) {
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
  return (
    <div className={classes.root}>
      <h3>{shiftDate.toDateString()}</h3>
      <h4>{`${timeStart} - ${timeEnd}`}</h4>
    </div>
  );
}
