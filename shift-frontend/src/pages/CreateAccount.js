import React, { useState } from "react";
import { TextField, Button, Box, makeStyles } from "@material-ui/core";
import { signup } from "../network/network";
import Snackbar from "../components/global/Snackbar";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert";

/* Account page
Allow for new user accounts to be created
*/
export default function Account() {
  // State values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarError, setOpenSnackbarError] = useState(false);

  const [emailInputError, setEmailInputError] = useState(false);
  const [passwordInputError, setPasswordInputError] = useState(false);

  const useStyles = makeStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      maxWidth: 500,
      margin: "0 auto",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      margin: "20px 0",
    },
    buttonSpacing: {
      margin: "10px 0",
    },
  });

  const classes = useStyles();

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

  // Send user account details to backend and create new account
  const handleCreateAccount = async () => {
    setEmailInputError(false);
    setPasswordInputError(false);
    setOpenSnackbar(false);
    setOpenSnackbarError(false);

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
    const response = await signup(name, email, isAdmin, password);

    // Server error handling
    if (!response) {
      console.log("Error - no response returned");
      // setLoginError(true);
      setOpenSnackbarError(true);
      return;
    }

    if (response.status === 401) {
      setOpenSnackbarError(true);
      return;
    }

    setOpenSnackbar(true);
  };

  return (
    <Box className={classes.root}>
      <h1>Create a new account</h1>
      <Alert
        severity="info"
        style={{
          margin: "20px 0",
        }}
      >
        Use this form to add new user accounts
      </Alert>{" "}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleCreateAccount();
        }}
      >
        <Box className={classes.form}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={classes.input}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            error={emailInputError}
            helperText={emailInputError && "Please enter a valid email address"}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className={classes.input}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="text"
            error={passwordInputError}
            helperText={
              passwordInputError &&
              "Please enter a password with at least six characters"
            }
            className={classes.input}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(event, checked) => setIsAdmin(checked)}
                name="admin"
                color="primary"
              />
            }
            label="Create new user as an admin?"
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.buttonSpacing}
            disabled={!email || !password || !name}
          >
            Submit
          </Button>
        </Box>
      </form>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={`Success - account created`}
        />
      )}
      {openSnackbarError && (
        <Snackbar
          open={openSnackbarError}
          onClose={() => setOpenSnackbarError(false)}
          message="Error - Could not create new user"
          type="error"
        />
      )}
    </Box>
  );
}
