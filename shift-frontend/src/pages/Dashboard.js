import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import View from "./View";
import Manage from "./Manage";
import Account from "./Account";
import getUserData from "../utils/getUserData";
import Menu from "../components/global/Menu";

export default function Dashboard() {
  console.log("Dashboard - running...");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      console.log("Dashboard: NOT LOGGED IN - REDIRECT");
      window.location.replace(`http://${window.location.host}/login`);
      return;
    }

    setUserData(userData);
  }, []);

  const adminRoutes = (
    <Switch>
      <Route exact path="/dashboard">
        <Redirect to="/dashboard/manage" />
      </Route>
      <Route path="/dashboard/view">
        <View />
      </Route>
      <Route path="/dashboard/manage">
        <Manage />
      </Route>
      <Route path="/dashboard/account">
        <Account />
      </Route>
    </Switch>
  );

  const employeeRoutes = (
    <Switch>
      <Route exact path="/dashboard">
        <Redirect to="/dashboard/view" />
      </Route>
      <Route path="/dashboard/view">
        <View />
      </Route>
      <Route path="/dashboard/account">
        <Account />
      </Route>
    </Switch>
  );

  // Regular non admin routes
  return (
    <Router>
      <Menu />
      <Switch>{userData?.isAdmin ? adminRoutes : employeeRoutes}</Switch>
    </Router>
  );
}
