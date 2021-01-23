import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import { useEffect } from 'react';

interface IShiftDashboardProps {}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      heading: {
         textAlign: 'center',
      },
   }),
);

interface ShiftData {
   date: string;
   time: string;
}

const ShiftDashboard: React.FunctionComponent<IShiftDashboardProps> = () => {
   useEffect(() => {
      fetch('./data.json')
         .then((response) => {
            return response.json();
         })
         .then((data) => {
            const shifts = data[0].shifts;
            shifts.forEach((item: ShiftData) => {
               console.log(item.date);
            });
         });
   });

   const classes = useStyles();
   return (
      <Typography variant={'h3'} className={classes.heading}>
         Shift Dashboard
      </Typography>
   );
};

export default ShiftDashboard;
