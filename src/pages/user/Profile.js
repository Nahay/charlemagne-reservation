import React, { useEffect, useState } from 'react';
import { decodeToken } from 'react-jwt';

import InputText from '../../components/generic/InputText';
import InputButton from '../../components/generic/InputButton';
import InputNumber from '../../components/generic/InputNumber';
import InputEmail from '../../components/generic/InputEmail';
import TextArea from '../../components/generic/TextArea';

import { updateUser, updateUserNoPw, getUserById } from '../../services/usersService';


const Profile = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [comment, setComment] = useState("");

    const nameReg = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/;
    const token = localStorage.getItem('userToken');
    const userDecoded = decodeToken(token);


    useEffect(() => {   

        async function getUser() {

            if (userDecoded) {
                setName(userDecoded.name);
                setFirstname(userDecoded.firstname);
                setEmail(userDecoded.email);
                setTel(userDecoded.tel);
            }
        }

        getUser();

    },[]);



    // HANDLE ------------------------------------------------------------

    const handleEmail = (e) => setEmail(e.target.value);

    const handlePassword = (e) => setPassword(e.target.value);

    const handleName = (e) => {
        const val = e.target.value;
        if (nameReg.test(val) || val === "") setName(val);
    }   

    const handleFirstname = (e) => {
        const val = e.target.value;
        if (nameReg.test(val) || val === "") setFirstname(val);
    }

    const handleTel = (e) => {
        const val = e.target.value;
        if(!isNaN(val)) setTel(val);
    }

    const handleCommentChange = (e) => setComment(e.target.value);


    // DB -----------------------------------------------------------------

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password === "") await updateUserNoPw(userDecoded._id, name, firstname, tel, comment, false, token);
        else await updateUser(userDecoded._id, password, name, firstname, tel, comment, false, token);
    }


    return (
        <div className="profile"> 
                
                <form className="profile__container" onSubmit={onSubmit}>

                    <div className="profile__input">
                        <label htmlFor="email">Email :</label>
                        <InputEmail
                            value={email}
                            placeholder="Email*"
                            handleChange={handleEmail}
                            readOnly={true}
                            id="email"
                        />
                    </div>
                    
                    <div className="profile__input">
                        <label htmlFor="mdp">Mot de passe :</label>
                        <InputText
                            value={password}
                            placeholder="Changer mot de passe"
                            required={false}
                            handleChange={handlePassword}
                            id="mdp"
                        />
                    </div>

                    <div className="profile__input">
                        <label htmlFor="nom">Nom :</label>
                        <InputText
                            value={name}
                            placeholder="Nom*"
                            handleChange={handleName}
                            id="nom"
                        />
                    </div>

                    <div className="profile__input">
                        <label htmlFor="prenom">Prénom :</label>
                        <InputText
                            value={firstname}
                            placeholder="Prénom*"
                            handleChange={handleFirstname}
                            id="prenom"
                        />
                    </div>

                    <div className="profile__input">
                        <label htmlFor="tel">Tel :</label>
                        <InputNumber
                            value={tel}
                            placeholder="Tel"
                            required={false}
                            handleChange={handleTel}
                            id="tel"
                        />
                    </div>
                    
                    <div className="profile__comment">
                        <label htmlFor="message">Commentaire prérentré dans chaque réservation :</label>
                        <TextArea
                            value={comment}
                            placeholder="Allergies, etc..."
                            required={false}
                            handleChange={handleCommentChange}
                            id="message"
                        />
                    </div>

                    <InputButton value="Enregistrer" type="submit"/>
                </form>
        </div>
    );
}
 
export default Profile;