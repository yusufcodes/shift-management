import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';

// import { useState } from 'react';
interface IAppProps {}
// TODO: Fix login modal (Go over Material UI docs again)
// const displayLogin = function (isLoginPressed: boolean): JSX.Element | null {
//    return isLoginPressed ? <LoginModal /> : null;
// };

const Landing: React.FunctionComponent<IAppProps> = () => {
   const [login, setLogin] = useState(false);
   return (
      <div className="landing">
         <Typography variant="h3">Welcome</Typography>
         <Typography variant="body1">To get started, use the button below to get yourself logged in!</Typography>
         <Button variant="contained" color="primary" onClick={() => setLogin(true)}>
            Login
         </Button>
         {/* {displayLogin(login)} */}
      </div>
   );
};

export default Landing;
