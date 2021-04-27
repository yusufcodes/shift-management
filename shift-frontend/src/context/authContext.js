import React from "react";

const authContext = React.createContext({
  isLoggedIn: false,
  token: null,
  isAdmin: null,
  name: null,
  email: null,
  setLoginToken: () => {},
  logout: () => {},
  setUserDetails: () => {},
});

export default authContext;
