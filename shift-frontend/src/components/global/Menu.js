import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Button,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";
import authContext from "../../context/authContext";

import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#4a4e69",
    color: "#f2f2f2",
    width: "100%",
    height: "55px",
  },
  iconColor: {
    color: "#f2f2f2",
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  heading: {
    fontWeight: "bold",
  },
  menuHeading: {
    marginLeft: "10px",
    fontWeight: "bold",
    fontSize: "21px",
  },
}));

export default function Menu() {
  const auth = React.useContext(authContext);

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const adminRoutes = [
    { label: "View", route: "/dashboard/view" },
    { label: "Manage", route: "/dashboard/manage" },
    { label: "Account", route: "/dashboard/account" },
  ];

  const employeeRoutes = [
    { label: "View", route: "/dashboard/view" },
    { label: "Account", route: "/dashboard/account" },
  ];

  const selectedRoute = auth.isAdmin ? adminRoutes : employeeRoutes;

  const list = (anchor) => (
    <>
      <p className={classes.menuHeading}>MENU</p>
      <Divider />
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {selectedRoute.map((item, index) => (
            <Link to={item.route}>
              <ListItem button key={index}>
                <ListItemText primary={item.label} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    </>
  );

  return (
    <React.Fragment key={"left"}>
      <div className={classes.root}>
        <Grid container alignItems="center">
          <Grid item>
            <IconButton
              aria-label="menu"
              color="primary"
              classes={{
                colorPrimary: classes.iconColor,
              }}
              onClick={toggleDrawer("left", true)}
            >
              <MenuIcon />
            </IconButton>
          </Grid>

          <Grid item>
            <p className={classes.heading}>Shift Application</p>
          </Grid>
        </Grid>
      </div>

      <Drawer
        anchor={"left"}
        open={state["left"]}
        onClose={toggleDrawer("left", false)}
      >
        {list("left")}
      </Drawer>
    </React.Fragment>
  );
}
