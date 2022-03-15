import { Switch, Route } from 'react-router-dom';

import ProtectedLoginRoute from '../components/routes/user/ProtectedLoginRoute';
import ProtectedUserRoute from '../components/routes/user/ProtectedUserRoute';

import SideNavbar from '../components/header/SideNavbar';
import HeaderIcon from '../components/header/HeaderIcon';

import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Order from '../pages/Order';
import PassCommand from '../pages/user/PassCommand';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import History from '../pages/user/History';
import Profile from '../pages/user/Profile';

import PageNotFound from '../pages/PageNotFound';


const UserTemp = () => {
    
    return ( 
        <>
            <SideNavbar admin={false}/>
            <HeaderIcon admin={false}/>
            <main className="main">
                <Switch>
                    <Route exact path="/" component = {Home} />

                    <Route exact path="/reserver" component = {Order} />
                    <Route exact path="/passer-reservation/:date" component = {PassCommand} />
                    <Route exact path="/contact" component = {Contact} />
                    <ProtectedUserRoute exact path="/historique" component = {History} />
                    <ProtectedUserRoute exact path="/profil" component = {Profile} />
                    <ProtectedLoginRoute exact path="/connexion" component = {Login}/>
                    <ProtectedLoginRoute exact path="/inscription" component = {SignUp} />

                    {/* <Route exact path="/mentions-legales" component = {Home} />
                    <Route exact path="/cgu-cgv" component = {Home} /> */}

                    <Route exact component = {PageNotFound} />
                </Switch>
            </main>
        </>
    );
}

export default UserTemp;