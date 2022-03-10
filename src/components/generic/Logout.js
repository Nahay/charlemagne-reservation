import React from "react";

import { decodeToken } from "react-jwt";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Logout = ({ handleLogout, handleLogin, isAuthenticated }) => { 

    const decodedToken = decodeToken(isAuthenticated);

    return (
        <div className="btn__logout" onClick={decodedToken ? handleLogout : handleLogin}>

            { decodedToken ?
                <div className="connect__container">
                    <p className="connect__name">{decodedToken.firstname} {decodedToken.name}</p>
                    <p>
                        <FontAwesomeIcon icon={faUser} />
                        Se déconnecter
                    </p>
                </div>
            :
                <div className="connect__container">
                    <p>
                        <FontAwesomeIcon icon={faUser} />
                        Se connecter
                    </p>
                </div>
            }            

        </div>
    );
};

export default Logout;