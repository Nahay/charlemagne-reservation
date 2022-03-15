import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import SignUpForm from '../components/SignUpForm';

import { userSignUp } from '../services/usersService';

const SignUp = () => {

    const history = useHistory();

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
     
    const nameReg = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/;
    const emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


    // HANDLE -------------------------------------------------------------------
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleNameChange = (e) => (nameReg.test(e.target.value) || e.target.value === "") && setName(e.target.value);
    const handleFirstnameChange = (e) => (nameReg.test(e.target.value) || e.target.value === "") && setFirstname(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleTelChange = (e) => !isNaN(e.target.value) && setTel(e.target.value);

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if(emailReg.test(email)) {
            const signUp = await userSignUp(email, password, name, firstname, tel, "");
            if(signUp.success){
                toast.success("Le compte a été crée avec succès ! Vous pouvez vous connecter.");
                history.goBack();
            }
            else toast.error(signUp.message);
        }
        else toast.error("L'adresse email entrée n'est pas valide.");
    }

    return (
        <div className="login-container">
            <SignUpForm            
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              handleNameChange={handleNameChange}
              handleFirstnameChange={handleFirstnameChange}
              handleTelChange={handleTelChange}
              handleSignUpSubmit={handleSignUpSubmit} 
              password={password}
              name={name}
              firstname={firstname}
              email={email}
              tel={tel}
            />
            <div className="login-icon">
                <FontAwesomeIcon icon={faUsers}/>
            </div>
        </div>
    );
}
 
export default SignUp;