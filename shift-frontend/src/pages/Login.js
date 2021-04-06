import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "../network/index";
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
  const auth = React.useContext(authContext);
  const { setLoginToken } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailInputError, setEmailInputError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);

  const [canSubmit, setCanSubmit] = useState(false);

  const [loginError, setLoginError] = useState(false);

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
    // Reset error message states
    setEmailInputError(false);
    setPasswordInputError(false);
    setLoginError(false);

    const emailValid = checkValidEmail(email);
    if (!emailValid) {
      setEmailInputError(true);
    }

    const passwordValid = checkValidPassword(password);
    if (!passwordValid) {
      setPasswordInputError(true);
    }

    if (emailInputError || passwordInputError) {
      return;
    }

    const performLogin = await login(email, password);
    if (!performLogin) {
      setLoginError(true);
      return;
    }
    if (!performLogin.status === 201) {
      setLoginError(true);
      return;
    }
    const { data } = performLogin;

    setLoginToken(data.token, data.userId, data.name, data.email, data.admin);
    setRedirect("/dashboard");
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
          error={emailInputError}
          helperText={emailInputError && "Please enter a valid email address"}
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
          error={passwordInputError}
          helperText={
            passwordInputError &&
            "Please enter a password with at least six characters"
          }
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
      {loginError ? (
        <Typography>Login credentials incorrect - please try again</Typography>
      ) : null}
    </Box>
  );
}
