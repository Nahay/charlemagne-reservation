import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { faMoon, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import SocialMediaList from '../SocialMediaList';


const HeaderFooter = ({admin, toggle}) => {  

    const theme = useRef(null);
    
    useEffect(() => {

        const localTheme = localStorage.getItem('theme');
        if (localTheme) {
          document.documentElement.setAttribute('data-theme', localTheme);
        }
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
        else document.documentElement.setAttribute('data-theme', 'light');

        if (document.documentElement.getAttribute('data-theme') === 'light') {
            theme.current.children[0].style.color = "rgb(255, 97, 79)";
        }
        else theme.current.children[2].style.color = "rgb(255, 97, 79)";
        
    }, []);
    
    
    const switchTheme = (newTheme) => {
    
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);

        if (newTheme === 'light') {
            theme.current.children[2].style.color = "black";
            theme.current.children[0].style.color = "rgb(255, 97, 79)";
            toast.success('Thème clair appliqué !');
        }
        else {
            theme.current.children[0].style.color = "white";
            theme.current.children[2].style.color = "rgb(255, 97, 79)";
            toast.success('Thème sombre appliqué !');
        }
    }


    return (    
        <div className = "header__footer">

            <div ref={theme} className="theme-icons">
                <FontAwesomeIcon icon={faLightbulb} size="lg" onClick={() => switchTheme('light')} />
                <p className='light__message'>Thème clair</p>
                <FontAwesomeIcon icon={faMoon} size="lg" onClick={() => switchTheme('dark')} />
                <p className='dark__message'>Thème sombre</p>
            </div>

            <SocialMediaList/>

            {/* actuellement en visibility hidden */}
            <div className = "footer__cg">
                <Link
                    to="/mentions-legales"
                    onClick={toggle}
                    rel={admin? "noopener noreferrer" : ""}
                    target={admin ? "_blank" : ""}
                >
                    Mentions légales
                </Link>
                <Link
                    to="/cgu-cgv"
                    onClick={toggle}
                    rel={admin? "noopener noreferrer" : ""}
                    target={admin ? "_blank" : ""}
                >
                    CGU/CGV
                </Link>
            </div>
            
        </div>
    );
}
 
export default HeaderFooter;