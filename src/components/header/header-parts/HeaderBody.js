import React from 'react';
import { useHistory, NavLink } from 'react-router-dom';

import { decodeToken } from 'react-jwt';
import { toast } from 'react-toastify';

import Logout from '../../generic/Logout';


const HeaderBody = ({ toggle }) => {

    const history = useHistory();
    
    const handleUserLogout = () => {
        localStorage.removeItem('userToken');
        history.push('/connexion');
        toast.success('À bientôt !');
    }

    const handleUserLogin = () => history.push('/connexion');

    const isLogged = () => { 
        const userDecoded = decodeToken(localStorage.getItem("userToken"));

        if (userDecoded) return true;
        return false;
    }


    return (
        <div className = "header__body">

            <Logout
                handleLogout={handleUserLogout}
                handleLogin={handleUserLogin}
                isAdmin={false}
                isAuthenticated={localStorage.getItem("userToken")}
            />

            <nav>
                <NavLink
                    exact to="/"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Accueil
                </NavLink>
                <NavLink
                    to="/commander"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Commander
                </NavLink>

                { isLogged() && 

                <NavLink
                    exact to="/history"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Historique
                </NavLink>
                
                }    

                <NavLink
                    exact to="/contact"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Contact
                </NavLink>
            </nav>
        </div>
    );
}
 
export default HeaderBody;