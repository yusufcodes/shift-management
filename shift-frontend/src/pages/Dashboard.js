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

export default function Dashboard() {
  const auth = React.useContext(authContext);

  return (
    <Router>
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
    </Router>
  );
}
