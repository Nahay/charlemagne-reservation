import React from 'react';

import SignUpForm from '../SignUpForm';

const SignBox = ({signRef, handlePasswordChange, handleSignUpSubmit, handleNameChange, handleFirstnameChange, handleTelChange, handleEmailChange, email, password, name, firstname, tel}) => {

    return (
        <div className="signup-container" ref={signRef}>
            <div className="signup-content">
                <p className="signup-title">S'inscrire</p>
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
                    isPage={false}
                />
            </div>            

            <div className="signup-background">
            </div>
        </div>
    );
}

export default SignBox;