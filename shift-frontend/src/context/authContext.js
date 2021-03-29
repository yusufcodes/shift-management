import React from "react";

const authContext = React.createContext({
  isLoggedIn: false,
  token: null,
  isAdmin: null,
  name: null,
  email: null,
  setLoginToken: () => {},
  setUserDetails: () => {},
  logout: () => {}, // to add
});

export default authContext;
