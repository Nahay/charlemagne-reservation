import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import LoginForm from '../components/LoginForm';

import { getFirstNameByUsername, userSignIn } from '../services/usersService';


const Login = () => {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
     
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const si = await userSignIn(username, password);
        // test si le token est présent dans la promesse qui a été configurée dans le server
        if (si.token) {
          // si il y est, on l'ajoute au local storage
          localStorage.setItem('userToken', si.token);
          history.goBack();
          const user = await getFirstNameByUsername(username);
          toast.success("Bienvenue " + user.userFound.firstname +" !");          
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
                <FontAwesomeIcon icon={faUsers}/>
            </div>
        </div>
    );
}
 
export default Login;