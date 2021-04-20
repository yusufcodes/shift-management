import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "../network/index";
import authContext from "../context/authContext";
import { Redirect } from "react-router-dom";

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
      return;
    }

    const passwordValid = checkValidPassword(password);
    if (!passwordValid) {
      setPasswordInputError(true);
      return;
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
        <Box className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => handleLogin()}
          >
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
