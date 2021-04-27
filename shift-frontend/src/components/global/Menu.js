import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Button, Grid } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, NavLink } from "react-router-dom";
import authContext from "../../context/authContext";
import getUserData from "../../utils/getUserData";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(() => ({
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
  link: {
    textDecoration: "none",
    color: "black",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function Menu() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userData = getUserData();
    setUserData(userData);
  }, []);

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

  const selectedRoute = userData?.isAdmin ? adminRoutes : employeeRoutes;

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
          {selectedRoute?.map((item, index) => (
            <NavLink
              to={item.route}
              key={index}
              exact
              className={classes.link}
              activeStyle={{
                textDecoration: "underline",
              }}
            >
              <ListItem button key={index}>
                <ListItemText primary={item.label} />
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Button
          style={{
            display: "flex",
            width: "90%",
            margin: "0 auto",
          }}
          variant="contained"
          color="primary"
          onClick={() => {
            auth.logout();
            window.location.replace(`http://${window.location.host}/login`);
          }}
        >
          Logout
        </Button>
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
