import { Switch } from "react-router-dom";

import ProtectedAdminRoute from "../components/routes/admin/ProtectedAdminRoute";

import SideNavbar from "../components/header/SideNavbar";
import HeaderIcon from "../components/header/HeaderIcon";

import AdminHome from "../pages/admin/AdminHome";
import AdminDishes from "../pages/admin/AdminDishes";
import AdminDates from "../pages/admin/AdminDates";
import AdminCommands from "../pages/admin/AdminCommands";
import AdminAccounts from "../pages/admin/AdminAccounts";

import PageNotFound from '../pages/PageNotFound';


const AdminTemp = () => {
  // match.url prend le chemin par défaut = /admin
  // path={ match.url + '/userlist' }

  return (
    <>
      <SideNavbar admin={true}/>
      <HeaderIcon admin={true}/>
      <main className="main">
        <Switch>
          <ProtectedAdminRoute exact path={'/admin/accueil'} component={AdminHome} />
          <ProtectedAdminRoute exact path={'/admin/plats'} component={AdminDishes} />
          <ProtectedAdminRoute exact path={'/admin/dates'} component={AdminDates} />
          <ProtectedAdminRoute exact path={'/admin/commandes'} component={AdminCommands} />
          <ProtectedAdminRoute exact path={'/admin/comptes'} component={AdminAccounts} />
          <ProtectedAdminRoute exact component = {PageNotFound} />
        </Switch>
      </main>
    </>
  );
};

export default AdminTemp;
