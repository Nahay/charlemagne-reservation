import React from "react";

import { decodeToken } from "react-jwt";
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Logout = ({ handleLogout, handleSignIn, handleSignUp, token}) => { 

    const decodedToken = decodeToken(token);

    return (
        <div className="btn__logout">

            { decodedToken ?
                <div className="connect__container">
                    <p className="connect__name">{decodedToken.firstname} {decodedToken.name}</p>
                    <div className="connect__icon-button">
                        <FontAwesomeIcon icon={faUser} />
                        <p onClick={handleLogout}>Se déconnecter</p>
                    </div>
                </div>
            :
                <div className="connect__container">
                    <div className="connect__content">
                    <FontAwesomeIcon icon={faUserPlus} />
                        <p onClick={handleSignUp}>S'inscrire</p>
                    </div>
                    <div className="connect__content">
                    <FontAwesomeIcon icon={faUser} />
                        <p onClick={handleSignIn}>Se connecter</p>
                    </div>
                </div>
            }            

        </div>
    );
};

export default Logout;