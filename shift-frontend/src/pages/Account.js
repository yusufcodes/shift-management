import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  makeStyles,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import getUserData from "../utils/getUserData";
import { updateUserDetails } from "../network/network";
import Snackbar from "../components/global/Snackbar";

export default function Account() {
  const [openModal, setOpenModal] = useState(false);

  const [name, setName] = useState("Loading name...");
  const [email, setEmail] = useState("Loading email...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSnackbarError, setOpenSnackbarError] = useState(false);
  const [openSnackbarLoadingError, setOpenSnackbarLoadingError] = useState(
    false
  );

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

  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      console.log("View: Not logged in");
      window.location.replace(`http://${window.location.host}/login`);
      return;
    }
    const { name, email } = userData;
    setName(name);
    setEmail(email);
  }, []);

  const handleUpdateEmail = async () => {
    setOpenSnackbar(false);
    setOpenSnackbarError(false);

    const userData = getUserData();
    const { userId, token } = userData;
    const response = await updateUserDetails(userId, token, email);
    if (!response) {
      setOpenSnackbarError(true);
      return;
    }
    if (response.status !== 201) {
      setOpenSnackbarError(true);
      return;
    }

    setOpenSnackbar(true);
  };

  const handleUpdatePassword = async () => {
    setOpenSnackbar(false);
    setOpenSnackbarError(false);
    setPasswordMatchError(false);

    if (newPassword !== newPasswordConfirm) {
      setPasswordMatchError(true);
      return;
    }

    const userData = getUserData();
    const { userId, token } = userData;
    const response = await updateUserDetails(
      userId,
      token,
      email,
      currentPassword,
      newPassword
    );
    if (!response) {
      setOpenSnackbarError(true);
      return;
    }
    if (response.status !== 201) {
      setOpenSnackbarError(true);
      return;
    }
    setOpenModal(false);
    setOpenSnackbar(true);
  };

  return (
    <Box className={classes.root}>
      <h1>Edit your details</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleUpdateEmail();
        }}
      >
        <Box className={classes.form}>
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={name}
            className={classes.input}
            disabled
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className={classes.input}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenModal(true)}
            className={classes.buttonSpacing}
          >
            Change Password
          </Button>
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="password-change-modal"
            aria-describedby="Modal to change password"
          >
            <form>
              <DialogTitle id="change-password-title">
                {"Change Password"}
              </DialogTitle>

              <DialogContent>
                <Box className={classes.root}>
                  <TextField
                    id="current-password"
                    label="Current Password"
                    variant="outlined"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    type="password"
                    className={classes.input}
                  />
                  <TextField
                    id="new-password"
                    label="New Password"
                    variant="outlined"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    type="password"
                    error={passwordMatchError}
                    helperText={
                      passwordMatchError &&
                      "Passwords in both of these fields much match"
                    }
                    className={classes.input}
                  />
                  <TextField
                    id="new-password-confirm"
                    label="Confirm New Password"
                    variant="outlined"
                    value={newPasswordConfirm}
                    onChange={(event) =>
                      setNewPasswordConfirm(event.target.value)
                    }
                    type="password"
                    error={passwordMatchError}
                    helperText={
                      passwordMatchError &&
                      "Passwords in both of these fields much match"
                    }
                    className={classes.input}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)} color="primary">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => handleUpdatePassword()}
                  disabled={
                    !currentPassword || !newPassword || !newPasswordConfirm
                  }
                  autoFocus
                >
                  Submit
                </Button>
              </DialogActions>
            </form>
          </Dialog>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.buttonSpacing}
            disabled={!email}
          >
            Submit
          </Button>
          {error && (
            <Typography>Error updating details - please try again</Typography>
          )}
        </Box>
      </form>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message="Success - Account details updated"
        />
      )}
      {openSnackbarError && (
        <Snackbar
          open={openSnackbarError}
          onClose={() => setOpenSnackbarError(false)}
          message="Error - Could not update details"
          type="error"
        />
      )}
      <Snackbar
        open={openSnackbarLoadingError}
        onClose={() => setOpenSnackbarLoadingError(false)}
        message="There was an error loading your details, please try again"
        type="error"
      />
    </Box>
  );
}
