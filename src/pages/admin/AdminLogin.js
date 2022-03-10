import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersCog } from '@fortawesome/free-solid-svg-icons';

import LoginForm from '../../components/LoginForm';

import { adminSignIn } from "../../services/adminsService";


const AdminLogin = () => {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
     
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLoginSubmit = async (e) => {

        e.preventDefault();

        const si = await adminSignIn(username, password);
        // test si le token est présent dans la promesse qui a été configurée dans le server
        if (si.token) {
          // si il y est, on l'ajoute au local storage
          localStorage.setItem('adminToken', si.token);
          history.push("/admin/accueil");
          toast.success(`Bienvenue ${username} !`);
        }
        else toast.error("Le nom d'utilisateur ou le mot de passe est incorrect.");
    }
            
    return ( 
        <div className="login-container">
            <LoginForm 
              handleUsernameChange={handleUsernameChange}
              handlePasswordChange={handlePasswordChange}
              handleLoginSubmit={handleLoginSubmit}
              username={username}
              password={password}
            />
            <div className="login-icon">
                <FontAwesomeIcon icon={faUsersCog}/>
            </div>
        </div>
    );
}

export default AdminLogin;