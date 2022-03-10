import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faMapMarkerAlt, faAt } from '@fortawesome/free-solid-svg-icons';

import ContactForm from '../components/contact/ContactForm';


const Contact = () => {

    return (            
            <div className="contact__container">
                <div className="contact__left">
                    <div className="left__content">
                        <h1>Contactez-nous</h1>
                        <p>Nous vous répondrons dans les plus bref délais !</p>
                        <ContactForm />
                    </div>
                </div>
                <div className="contact__right">
                    <div className="right__bg"></div>
                    <div className="right__content">
                        <h1>Lycée des Métiers Charles Pointet</h1>
                        <div className="right__list">
                            <div className="right__info">
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                <a
                                    href="https://www.google.fr/maps/place/Lyc%C3%A9e+des+M%C3%A9tiers+Charles+Pointet/@47.8141899,7.0916285,17z/data=!3m1!4b1!4m5!3m4!1s0x47922a5d77b35dab:0xc7386213bfeb0042!8m2!3d47.8142934!4d7.0935604"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    5 rue des Tirailleurs Marocains 68800 Thann
                                </a>
                            </div>
                            <div className="right__info">
                                <FontAwesomeIcon icon={faPhone} />
                                <a href="tel:+33389377400">03 89 37 74 00</a>
                            </div> 
                            <div className="right__info">
                                <FontAwesomeIcon icon={faAt} />
                                <a href="mailto:ce.0680074L@ac-strasbourg.fr">ce.0680074L@ac-strasbourg.fr</a>
                            </div>
                        </div>
                    </div>
                </div>        
        </div>
    );
}

export default Contact;