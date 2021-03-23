import "./App.css";
import React, { useState } from "react";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import authContext from "./context/authContext";

/*
Land on login: if not logged in
Land on dashboard: once logged in
*/

const DefaultTheme = createMuiTheme();
let theme = {
  ...DefaultTheme,
};
theme = responsiveFontSizes(theme);

function App() {
  const [token, setToken] = useState("");

  const setLoginToken = (token) => {
    console.log(`Setting token: ${token}`);
    setToken(token);
  };

  return (
    <Router>
      <authContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          setLoginToken: setLoginToken,
        }}
      >
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </ThemeProvider>
      </authContext.Provider>
    </Router>
  );
}

export default App;
