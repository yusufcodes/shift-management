import React, { useEffect, useState } from "react";
import { getUsers, getShiftsByUserId } from "../network/index";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import authContext from "../context/authContext";
import Shift from "../components/shift/Shift";

/*
      1. Get all users - endpoint

      2. Response -> Use Material selector to populate dropdown 

      3. onChange (or similar) of dropdown:
      - getShiftsById (Get user ID of the selected person)
      - Store result in state

      4. If shifts state exists -> Output shifts - use Shift component already made

      5. Extend shift component so that it can be edited.

*/

export default function Manage() {
  const [allUsers, setAllUsers] = useState(null);
  const auth = React.useContext(authContext);

  // Store the user ID of employee that is selected
  const [selectedUser, setSelectedUser] = useState("");
  const [shifts, setShifts] = useState(null);

  // On initial render: load users to select
  useEffect(() => {
    (async () => {
      const response = await getUsers();
      console.log(response);
      if (!response || response.status !== 200) {
        throw new Error("Manage.js: Could not get all users");
      }
      const userOptions = response.data.users.map((item) => {
        return <option value={item.id}>{item.name}</option>;
      });
      setAllUsers(userOptions);
    })();
  }, []);

  // Load selected user's shifts
  useEffect(() => {
    if (selectedUser.length < 1) {
      console.log("No selected user");
      // Output no user selected or similar
      return;
    }
    (async () => {
      const response = await getShiftsByUserId(auth.token, selectedUser);
      if (!response) {
        return;
      }
      setShifts(response.data.userShifts);
    })();
  }, [selectedUser]);

  const outputShifts = shifts?.map((item) => {
    return (
      <Shift
        starttime={item.starttime}
        endtime={item.endtime}
        id={item.id}
        admin
      />
    );
  });

  const outputNoShifts = <p>No shifts for this user</p>;

  return (
    <div>
      <h1>Manage Shifts</h1>
      <h2>Select a user: </h2>
      <FormControl>
        <InputLabel htmlFor="age-select">Employee</InputLabel>
        <Select
          native
          value={selectedUser}
          onChange={(event) => {
            setShifts(null);
            setSelectedUser(event.target.value);
          }}
          inputProps={{
            name: "employee",
            id: "age-select",
          }}
        >
          <option aria-label="None" value="" />
          {allUsers}
        </Select>
      </FormControl>
      {shifts ? outputShifts : null}
      {!shifts && selectedUser.length > 1 ? outputNoShifts : null}
    </div>
  );
}
