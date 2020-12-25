import React from 'react';
import Landing from './components/Landing';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Container, createMuiTheme, createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core';
import Drawer from './components/Drawer';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         display: 'flex',
      },
      toolbar: theme.mixins.toolbar,
      content: {
         flexGrow: 1,
         padding: theme.spacing(3),
      },
   }),
);

const App: React.FC = () => {
   const classes = useStyles();
   const theme = createMuiTheme({
      palette: {
         primary: {
            light: '#5878a6',
            main: '#274c77',
            dark: '#00254b',
            contrastText: '#ffffff',
         },
         secondary: {
            light: '#91c7ec',
            main: '#6096ba',
            dark: '#2d688a',
            contrastText: '#000000',
         },
      },
      overrides: {
         MuiCssBaseline: {
            '@global': {
               html: {
                  WebkitFontSmoothing: 'auto',
               },
            },
         },
      },
   });

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline />
         <Drawer />
         <div className={classes.root}>
            <main className={classes.content}>
               <div className={classes.toolbar} />
               <Container maxWidth="sm">
                  <Landing />
               </Container>
            </main>
         </div>
      </ThemeProvider>
   );
};

export default App;
