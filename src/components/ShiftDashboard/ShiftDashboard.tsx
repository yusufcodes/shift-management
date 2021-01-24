import { createStyles, makeStyles, responsiveFontSizes, Theme, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ShiftList from './ShiftList/ShiftList';

interface IShiftDashboardProps {}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      heading: {
         textAlign: 'center',
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
      <>
         <Typography variant={'h3'} className={classes.heading}>
            Shift Dashboard
         </Typography>
         <ShiftList data={shiftData} />
      </>
   );
};

export default ShiftDashboard;
