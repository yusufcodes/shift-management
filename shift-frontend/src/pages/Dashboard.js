import React from "react";
import authContext from "../context/authContext";

export default function Dashboard() {
  const auth = React.useContext(authContext);
  console.log(auth.token);
  console.log(auth.isLoggedIn);
  return (
    <div>
      <h1>{`Hello dashboard`}</h1>
    </div>
  );
}
