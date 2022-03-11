import React from 'react';
import { useHistory } from 'react-router-dom';
import InputButton from './generic/InputButton';
import InputText from './generic/InputText';
import InputPassword from "./generic/InputPassword";


const LoginForm = ({handleUsernameChange, handlePasswordChange, handleLoginSubmit, username, password, user}) => {
    const history = useHistory();
    return ( 
        
        <form className="login-form" onSubmit={handleLoginSubmit}>
            <div className="login-form__content">
                {user && 
                <div className="content__switch-buttons">
                    <div className="input-btn">
                        <input type="button" value="S'inscrire" onClick={() => history.push("/inscription")}/>
                        </div>                    
                    <div className="input-btn">
                        <input type="button" value="Se connecter" className="active"/>
                    </div>
                </div>
                }
                <InputText placeholder="Nom d'utilisateur" handleChange={handleUsernameChange} value={username}/>
                <InputPassword placeholder="Mot de passe" handleChange={handlePasswordChange} value={password}/>
                <div className="content__password">
                    <span>Mot de passe oublié ?</span>
                    <p>Merci de contacter les professeurs de l'hotellerie.</p>
                </div>
                <InputButton value="Se connecter" type="submit"/>
            </div>
        </form>
    );
}

export default LoginForm;