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

export default function Dashboard() {
  const auth = React.useContext(authContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/dashboard">
          <Redirect to="/dashboard/view" />
        </Route>
        <Route path="/dashboard/view">
          <View />
        </Route>
      </Switch>
    </Router>
  );
}
