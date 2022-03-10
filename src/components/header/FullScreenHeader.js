import React from 'react';

import HeaderTop from './header-parts/HeaderTop';
import HeaderBody from './header-parts/HeaderBody';
import HeaderFooter from './header-parts/HeaderFooter';
import AdminHeaderBody from './header-parts/AdminHeaderBody';


const FullScreenHeader = ({toggle, admin}) => {

    return (
        <header className = "full-screen-header">
            <HeaderTop admin={admin} toggle = {toggle}/>
            {admin ? <AdminHeaderBody toggle = {toggle}/> : <HeaderBody toggle = {toggle}/>}
            <HeaderFooter admin={admin} toggle = {toggle}/>
        </header>
    );
}

export default FullScreenHeader;