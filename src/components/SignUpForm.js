import React from 'react';
import { useHistory } from 'react-router-dom';

import InputButton from './generic/InputButton';
import InputText from './generic/InputText';
import InputPassword from "./generic/InputPassword";
import InputNumber from "./generic/InputNumber";


const SignUpForm = ({isPage, handlePasswordChange, handleSignUpSubmit, handleNameChange, handleFirstnameChange, handleTelChange, handleEmailChange, email, password, name, firstname, tel }) => {

    const history = useHistory();

    return (         
        <form className="login-form signup" onSubmit={handleSignUpSubmit}>
            <div className="login-form__content">

                {isPage &&
                <div className="switch-form">
                    <p onClick={() => history.push("/connexion")}>Se connecter</p>
                </div>
                }
                <div className="input-duo"> 
                    <InputText placeholder="Nom*" handleChange={handleNameChange} value={name}/>
                    <InputText placeholder="Prénom*" handleChange={handleFirstnameChange} value={firstname}/>
                </div>

                <InputText placeholder="Email*" handleChange={handleEmailChange} value={email}/>
                <InputPassword placeholder="Mot de passe*" handleChange={handlePasswordChange} value={password}/>
               
  
                <InputNumber placeholder="Tel" handleChange={handleTelChange} value={tel} required={false}/>

                <InputButton value="S'inscrire" type="submit"/>
            </div>
        </form>
    );
}

export default SignUpForm;