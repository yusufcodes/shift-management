import React from "react";
import authContext from "../context/authContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import View from "./View";
import Manage from "./Manage";
import Menu from "../components/global/Menu";

export default function Dashboard() {
  const auth = React.useContext(authContext);

  console.log(auth);

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
    </Switch>
  );

  // Regular non admin routes
  return (
    <Router>
      <Menu />
      <Switch>{auth.isAdmin ? adminRoutes : employeeRoutes}</Switch>
    </Router>
  );
}
