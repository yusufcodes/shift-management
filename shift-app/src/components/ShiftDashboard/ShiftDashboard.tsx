import { createStyles, makeStyles, responsiveFontSizes, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ShiftList from './ShiftList/ShiftList';

interface IShiftDashboardProps {}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         margin: '0 auto',
         width: '80%',
      },
   }),
);

const ShiftDashboard: React.FunctionComponent<IShiftDashboardProps> = () => {
   const [shiftData, setShiftData] = useState([]);
   const [fetchingData, setFetchingData] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         if (fetchingData) {
            try {
               const response = await fetch('./data.json');
               const data = await response.json();
               setShiftData(data[0].shifts);
            } catch (error) {
               console.log(error);
            }
         }
      };
      fetchData();

      return () => setFetchingData(false);
   });

   const classes = useStyles();

   return (
      <div className={classes.root}>
         <Typography variant={'h3'}>Shift Dashboard</Typography>
         <ShiftList data={shiftData} />
      </div>
   );
};

export default ShiftDashboard;
