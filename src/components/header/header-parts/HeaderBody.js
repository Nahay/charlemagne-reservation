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

    const handleUserSignIn = () => history.push('/connexion');

    const handleUserSignUp = () => history.push('./inscription');

    const isLogged = () => { 
        const userDecoded = decodeToken(localStorage.getItem("userToken"));

        if (userDecoded) return true;
        return false;
    }


    return (
        <div className = "header__body">

            <Logout
                handleLogout={handleUserLogout}
                handleSignIn={handleUserSignIn}
                handleSignUp={handleUserSignUp}
                isAdmin={false}
                token={localStorage.getItem('userToken')}
            />

            <nav>
                <NavLink
                    exact to="/"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Accueil
                </NavLink>
                <NavLink
                    to="/reserver"
                    activeClassName="active-link"
                    onClick={toggle}>
                        Réserver
                </NavLink>

                { isLogged() && 

                    <>
                        <NavLink
                            exact to="/profil"
                            activeClassName="active-link"
                            onClick={toggle}>
                                Profil
                        </NavLink>

                        <NavLink
                            exact to="/historique"
                            activeClassName="active-link"
                            onClick={toggle}>
                                Historique
                        </NavLink>
                    </>
                
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