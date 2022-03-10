import React, { useState, useRef, useEffect } from 'react';

import { toast } from 'react-toastify';
import { decodeToken } from "react-jwt";
// import emailjs from 'emailjs-com';

import InputText from '../generic/InputText';
import InputButton from '../generic/InputButton';
import InputEmail from '../generic/InputEmail';
import TextArea from '../generic/TextArea';
import InputNumber from '../generic/InputNumber';


const ContactForm = () => {

    const form = useRef(null);

    const token = localStorage.getItem("userToken");
    const decodedToken = decodeToken(token);

    const nameReg = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/;
    const emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    
    const [email, setEmail] = useState(decodedToken ? decodedToken.email : "");
    const [name, setName] = useState(decodedToken ? decodedToken.firstname + " " + decodedToken.name : "");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [captcha, setCaptcha] = useState([]);
    const [answer, setAnswer] = useState('');


    useEffect(() => {
        for (let i = 0; i<2; i++)
            setCaptcha(captcha => [...captcha, Math.floor(Math.random() * 10) + 1])
    }, []);

    // RESET VALUES -----------------------------------------------------

    const resetValues = () => {
        setEmail("");
        setName("");
        setMessage("");
        setSubject("");
    }

    // HANDLE -------------------------------------------------------------------------------------------

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleNameChange = (e) => {
        const val = e.target.value;
        if (nameReg.test(val) || val === "") setName(val);
    }
    
    const handleSubjectChange = (e) => setSubject(e.target.value);

    const handleMessageChange = (e) => setMessage(e.target.value);

    const handleAnswerChange = (e) => {
        const val = e.target.value;
        if (Number(val) || val === "") setAnswer(val)
    }

    const sendEmail = (e) => {
        e.preventDefault();
        if (emailReg.test(email)) {
            if (Number(answer) === captcha[0]+captcha[1]) {
                // emailjs.sendForm('service_yp9mjg9', 'lycee_template', form.current, 'user_kJVhkhpgVxlSmIHEaC2pI');
                toast.success("Votre message a été envoyé avec succès !");
                resetValues();
            }
            else toast.error("Captcha faux, veuillez retenter le calcul.");
        }
        else toast.error("L'adresse email saisie est incorrecte.");
    }

    return (
        <>
            <form className="contact__form" onSubmit={sendEmail} ref={form}>
                <div className="contact__input">
                    <div className="input__name-email">
                        <InputText
                            value={name}
                            placeholder="Nom*"
                            handleChange={handleNameChange}
                        />
                        <InputEmail value={email} placeholder="Email*" handleChange={handleEmailChange} />
                    </div>
                    <InputText value={subject} placeholder="Objet*" handleChange={handleSubjectChange} />
                    <TextArea value={message} placeholder="Message*" handleChange={handleMessageChange} />
                    <InputNumber value={answer} placeholder={`${captcha[0]} + ${captcha[1]}*`} handleChange={handleAnswerChange} />
                    <div className="input__btn">
                        <InputButton value="Envoyer le message" type="submit"/>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ContactForm;