import React from "react";

const authContext = React.createContext({
  isLoggedIn: false,
  token: null,
  setLoginToken: () => {},
  logout: () => {},
});

export default authContext;
