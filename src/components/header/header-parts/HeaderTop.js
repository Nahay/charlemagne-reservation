import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../generic/Logo';



const HeaderTop = ({admin, toggle}) => {

    return (
        <div className = "header__top">
            <Link
                to = "/"
                onClick={toggle}
                rel={admin? "noopener noreferrer" : ""}
                target={admin ? "_blank" : ""}
            >
                <Logo/>
                <span>Le Charlemagne</span>
            </Link>
        </div>
    );
}
 
export default HeaderTop;