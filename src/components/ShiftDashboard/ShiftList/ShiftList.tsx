import * as React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import { makeStyles, Theme, createStyles, Box } from '@material-ui/core';

interface IShiftListProps {
   data: any;
}

interface iShiftData {
   id: number;
   date: string;
   time: string;
}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         width: '100%',
         maxWidth: 360,
         backgroundColor: theme.palette.background.paper,
      },
   }),
);

const ShiftList: React.FunctionComponent<IShiftListProps> = ({ data }) => {
   const classes = useStyles();
   return (
      <Box className={classes.root}>
         <List>
            {data.map((item: iShiftData) => (
               <>
                  <Box key={item.id}>
                     <ListItem>
                        <ListItemText
                           primary={
                              <div>
                                 <div>Date: {item.date}</div>
                                 <div>Time: {item.time}</div>
                              </div>
                           }
                        />
                     </ListItem>
                  </Box>
                  <Divider></Divider>
               </>
            ))}
         </List>
      </Box>
   );
};

export default ShiftList;
