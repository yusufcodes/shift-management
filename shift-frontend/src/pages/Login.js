import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "../network/index";
import authContext from "../context/authContext";
import { Redirect } from "react-router-dom";
import Snackbar from "../components/global/Snackbar";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white",
    backgroundColor: "#4a4e69",
    border: "1px solid #c7c7c7",
    borderRadius: "10px",
    width: "50%",
    margin: "100px auto",
    padding: "70px",
  },
  inputRoot: {
    color: "white",
    display: "flex",
    margin: "30px 0",
  },
  inputLabel: {
    color: "white",
    backgroundColor: "#4a4e69",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "30px 0",
  },
  button: {
    color: "white",
    padding: "10px 60px",
  },
  form: {
    width: "100%",
    maxWidth: "500px",
  },
  heading: {
    fontSize: "40px",
    display: "flex",
    textAlign: "center",
    margin: "30px 0",
  },
});

export default function Login() {
  const auth = React.useContext(authContext);
  const { setLoginToken } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailInputError, setEmailInputError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);

  const [loginError, setLoginError] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [generalError, setGeneralError] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [redirect, setRedirect] = useState(null);

  // Use regex to determine if the email the user enters is correct
  const checkValidEmail = (email) => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!valid) return false;

    return true;
  };

  const checkValidPassword = (password) => {
    const valid = password.length >= 6;
    if (!valid) return false;
    return true;
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    // Reset error message states
    setEmailInputError(false);
    setPasswordInputError(false);
    setLoginError(false);
    setLoginSuccessful(false);
    setGeneralError(false);

    const emailValid = checkValidEmail(email);
    if (!emailValid) {
      setEmailInputError(true);
      setIsLoggingIn(false);
      return;
    }

    const passwordValid = checkValidPassword(password);
    if (!passwordValid) {
      setPasswordInputError(true);
      setIsLoggingIn(false);
      return;
    }

    if (emailInputError || passwordInputError) {
      setIsLoggingIn(false);
      return;
    }

    const performLogin = await login(email, password);

    console.log("Performing login, response returned: ");
    console.log(performLogin);

    if (!performLogin) {
      console.log("Error - no response returned");
      // setLoginError(true);
      setGeneralError(true);
      setIsLoggingIn(false);
      return;
    }

    if (performLogin.status === 401) {
      setLoginError(true);
      setIsLoggingIn(false);
      return;
    }

    setLoginSuccessful(true);
    const { data } = performLogin;

    setLoginToken(data.token, data.userId, data.name, data.email, data.admin);
    setIsLoggingIn(false);

    setRedirect("/dashboard");
  };

  const classes = useStyles();

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <Box className={classes.root}>
      <Box>
        <Typography variant="h1" className={classes.heading}>
          Shift Management App
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="h2"
          style={{
            fontSize: "30px",
            margin: "20px 0",
          }}
        >
          Login 👋🏼
        </Typography>
      </Box>
      <form className={classes.form}>
        <Box>
          <TextField
            classes={{
              root: classes.inputRoot,
            }}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            error={emailInputError}
            helperText={emailInputError && "Please enter a valid email address"}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Box>
        <Box>
          <TextField
            classes={{
              root: classes.inputRoot,
            }}
            InputLabelProps={{
              className: classes.inputLabel,
            }}
            id="password"
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            error={passwordInputError}
            helperText={
              passwordInputError &&
              "Please enter a password with at least six characters"
            }
            onChange={(event) => setPassword(event.target.value)}
          />
        </Box>
        {loginError ? (
          <Typography
            style={{
              color: "#f44336",
            }}
          >
            Login credentials incorrect - please try again
          </Typography>
        ) : null}
        {loginSuccessful ? (
          <Typography
            style={{
              color: "#4BB543",
            }}
          >
            Login successful
          </Typography>
        ) : null}
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleLogin()}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </form>
      <Snackbar
        open={generalError}
        onClose={() => setGeneralError(false)}
        message="Oops, looks like something went wrong - please try again"
        type="error"
      />
    </Box>
  );
}
