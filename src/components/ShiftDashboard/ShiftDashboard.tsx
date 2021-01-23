import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

interface IShiftDashboardProps {}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      heading: {
         textAlign: 'center',
      },
   }),
);

interface iShiftData {
   id: number;
   date: string;
   time: string;
}

const ShiftDashboard: React.FunctionComponent<IShiftDashboardProps> = () => {
   const [shiftData, setShiftData] = useState([]);

   useEffect(() => {
      fetch('./data.json')
         .then((response) => response.json())
         .then((data) => setShiftData(data[0].shifts));
   });

   const classes = useStyles();
   return (
      <>
         <Typography variant={'h3'} className={classes.heading}>
            Shift Dashboard
         </Typography>
         <ul>
            {shiftData.map((item: iShiftData) => (
               <li key={item.id}>
                  {item.date} - {item.time}
               </li>
            ))}
         </ul>
      </>
   );
};

export default ShiftDashboard;
