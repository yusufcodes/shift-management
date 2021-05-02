import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
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

/* App - entry point for the application, setting up the following:
- Storing user data in local storage upon successful login
- Handle logout method: clearing localStorage
- Setting up initial Login and Dashboard routes
*/
function App() {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    setEmail(null);
    setName(null);
    localStorage.removeItem("userData");
  }, []);

  const setLoginToken = useCallback((token, userId, name, email, isAdmin) => {
    setToken(token);
    localStorage.setItem(
      "userData",
      JSON.stringify({ userId, token, name, email, isAdmin })
    );
  }, []);

  useEffect(() => {
    console.log("App.js - running...");
    const data = JSON.parse(localStorage.getItem("userData"));
    const { userId, token, name, email, isAdmin } = data || {};
    if (data && token) {
      setLoginToken(token, userId, name, email, isAdmin);
      console.log("App.js: User is logged in");
    }
  }, [setLoginToken]);

  return (
    <Router>
      <authContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          isAdmin: admin,
          name: name,
          email: email,
          setLoginToken: setLoginToken,
          logout: logout,
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
