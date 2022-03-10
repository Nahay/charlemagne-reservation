import React from "react";
import { Route, useHistory } from "react-router-dom";

import { decodeToken } from "react-jwt";

import { getUserById } from '../../../services/usersService';


function ProtectedLoginRoute({ component: Component, ...restOfProps }) {
  
  const history = useHistory();

  const getUser = async () => {

    const token = localStorage.getItem("userToken");
    const decodedToken = decodeToken(token);
    
    if (decodedToken !== null) {
        const user = await getUserById(decodedToken._id);
        if (user.success) {
          history.push('/');
          return true;
        }
    }
    localStorage.removeItem('userToken');
    return false;
  }


  return (
    <Route
        {...restOfProps}
        render={(props) =>
        getUser() && <Component {...props} />
      }
    />
  );
}

export default ProtectedLoginRoute;