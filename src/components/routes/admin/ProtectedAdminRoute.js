import React from "react";
import { Route, useHistory } from "react-router-dom";

import { decodeToken } from "react-jwt";

import { getAdminById } from "../../../services/adminsService";


function ProtectedAdminRoute({ component: Component, ...restOfProps }) {

  const history = useHistory();

  const getAdmin = async () => {

    const token = localStorage.getItem("adminToken");
    const decodedToken = decodeToken(token);
    
    if(decodedToken !== null) {
      const admin = await getAdminById(decodedToken._id, token);
      if(admin.success) { return true }
    }
    localStorage.removeItem('adminToken');
    history.push('/admin');
    return false;
  }

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        getAdmin() && <Component {...props} />
      }
    />
  );
}

export default ProtectedAdminRoute;