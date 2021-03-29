import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { getAllUsers, login } from "../network/index";
import authContext from "../context/authContext";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    color: "white",
    backgroundColor: "#4a4e69",
    border: "1px solid #c7c7c7",
    borderRadius: "10px",
    //  margin: "auto",
    //  margin: "0 auto",
    width: "50%",
    margin: "300px auto",
    padding: "70px",
  },
  input: {
    color: "white",
  },
  button: {
    color: "white",
  },
});

export default function Login() {
  // const { setLoginToken } = useAuth();
  const auth = React.useContext(authContext);
  const { setLoginToken, setUserDetails } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(null);

  const handleLogin = async () => {
    const performLogin = await login(email, password);
    if (!performLogin) {
      console.log("login failed");
      return;
    }
    if (performLogin.status === 201) {
      console.log(performLogin);

      const { data } = performLogin;

      setLoginToken(data.token);
      setUserDetails(data.admin, data.name, data.email);

      setRedirect("/dashboard");
    }
  };

  const classes = useStyles();

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <Box className={classes.root}>
      <Typography variant="h2">Login</Typography>
      <form>
        <TextField
          classes={{
            root: classes.input,
          }}
          id="email"
          label="Email"
          variant="outlined"
          InputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            className: classes.input,
          }}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          className={classes.input}
          InputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            className: classes.input,
          }}
          id="password"
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => handleLogin()}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
