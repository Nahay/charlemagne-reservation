import React, {useState, useEffect, useRef} from 'react';

import { toast } from 'react-toastify';
import { faUser, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decodeToken } from 'react-jwt';

import InputText from '../../components/generic/InputText';
import InputButton from '../../components/generic/InputButton';
import InputNumber from '../../components/generic/InputNumber';
import InputEmail from '../../components/generic/InputEmail';
import AccountList from '../../components/admin/AccountList';
import Box from "../../components/generic/Box";

import { createUser, hideUser, getVisibleUsers, updateUser, updateUserNoPw, getUserByUsername } from '../../services/usersService';
import { createAdmin, deleteAdmin, getAdminById, getAdminByUsername, getAdmins, updateAdmin } from '../../services/adminsService';


const AdminAccounts = () => {
    
    const box = useRef(null);
    const token = localStorage.getItem("adminToken");

    const [currentAdmin, setCurrentAdmin] = useState({});
    const [admin, setAdmin] = useState(false);

    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [firstname, setFirstname] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");

    const [create, setCreate] = useState(true);
    const [watchClients, setWatchClients] = useState(true);

    const [clientAccountList, setClientAccountList] = useState([]);
    const [adminAccountList, setAdminAccountList] = useState([]);

    const nameReg = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'-]+$/;
    const emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


    useEffect(() => { 
        const token = localStorage.getItem("adminToken");

        async function getClientAccountList() {
            const clients = await getVisibleUsers(token);
            setClientAccountList(clients.users);
        }
    
        async function getAdminAccountList() {
            const admins = await getAdmins(token);
            setAdminAccountList(admins.admins);
        }

        async function getCurrentAdmin() {
  
            const adminDecoded = decodeToken(localStorage.getItem("adminToken"));
    
            if (adminDecoded) {  
                const admin = await getAdminById(adminDecoded._id, token);
                // it returns an object with { success: true, user { all the user's info } }
                if (admin.success) {  
                    const { _id } = admin.admin;
                    setCurrentAdmin({_id});              
                }
            }
        }


        getCurrentAdmin();
        getClientAccountList();
        getAdminAccountList();

    }, []);
  
    // RESET VALUES -----------------------------------------------------

    const resetValues = () => {
        setCreate(true);

        setAdmin(false);
        setEmail("");
        setUsername("");
        setPassword("");
        setName("");
        setFirstname("");
        setTel("");
    }

    const onClickClientAccount = ({ _id, email, username, name, firstname, tel }) => {
        setId(_id);
        setAdmin(false);
        setCreate(false);
        setEmail(email);
        setUsername(username);
        setPassword("");
        setName(name);
        setFirstname(firstname);
        setTel(tel);
    }

    const onClickAdminAccount = (username, _id) => {
        setAdmin(true);
        setId(_id);
        setCreate(false);
        setUsername(username);
        setPassword("");
    }

    // HANDLE ------------------------------------------------------------

    const handleAdminChange = (e) => {
        if (e.target.id ==='y') setAdmin(true);
        else setAdmin(false);
    }

    const handleEmail = (e) => setEmail(e.target.value);

    const handleUsername = (e) => setUsername(e.target.value);

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
    

    // DB -------------------------------------------------------------

    const getClientAccountList = async () => {
        const clients = await getVisibleUsers(token);
        setClientAccountList(clients.users);
    }

    const getAdminAccountList = async () => {
        const admins = await getAdmins(token);
        setAdminAccountList(admins.admins);
    }

    const onClickDeleteAccount = (id) => {        
        box.current.style.visibility = "visible";
        box.current.style.opacity = 1;
        setId(id);
    }

    const onClickConfirmation = () => {
        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
    }

    const onClickDelete = async () => {
        
        if (watchClients) {
            await hideUser(id, token);

            getClientAccountList();
        }

        else {
            if (currentAdmin._id === id) {
                toast.error("Vous ne pouvez pas supprimer le compte sur lequel vous êtes connectés !")
                return;
            }
            
            await deleteAdmin(id, token);

            getAdminAccountList();
            
        }

        setId("");
        setCreate(true);

        box.current.style.visibility = "hidden";
        box.current.style.opacity = 0;
        
    }

    const onSubmit = async (e) => {

        e.preventDefault();

        try {

            // création d'un utilisateur
            if (create) {

                if (admin) {

                    // test s'il existe déjà un administrateur avec le nom d'utilisateur entré
                    const adminAlreadyExist = await getAdminByUsername(username, token);

                    if (adminAlreadyExist.success) toast.error("Il existe déjà un compte administrateur possédant ce nom d'utilisateur.");

                    else {                        
                        // ajout bdd admin
                        await createAdmin(username, password, token);
                        getAdminAccountList();
                        resetValues();
                    }                   
                }

                else {
        
                    if (emailReg.test(email)) {

                        // test s'il existe déjà un utilisateur avec le nom d'utilisateur entré

                        const userAldreadyExist = await getUserByUsername(username, token);
                        if (userAldreadyExist.success) toast.error("Il existe déjà un compte utilisateur possédant ce nom d'utilisateur.");

                        else {
                            // ajout bdd client
                            await createUser(username, password, name, firstname, email, tel, token);
                            getClientAccountList();
                            resetValues();
                        }                       
                    }
                    
                    else toast.error("Email non valide.");
                }
            }

            // modification d'un utilisateur
            else {

                if (admin) {
                    // mot de passe inchangé
                    if (password === "") toast.error("Il faut entrer un mot de passe !");

                    // update bdd admin
                    else {
                        await updateAdmin(id, password, token);
                        resetValues();
                        getAdminAccountList();
                    }
                    
                }
                else {        
                    if (emailReg.test(email)) {
                        if (password === "") {
                            // update bdd client sans mdp
                            await updateUserNoPw(id, name, firstname, email, tel, token);
                        }
                        // update bdd client
                        else {                            
                            await updateUser(id, password, name, firstname, email, tel, token);
                        }
                        getClientAccountList();
                        resetValues();
                    }                    
                    else toast.error("Email non valide.");
                }

            }
        }
        catch(err) {
            toast.error("Il y a eu une erreur.");
        }
    }


    // RENDER ----------------------------------------------------------

    // si create on met le radio sinon on l'enlève
    // selon admin ou pas aussi

    return (
        <div className="admin-accounts">

            <Box onClickConfirmation={onClickConfirmation} onClickDelete={onClickDelete} boxRef={box} message={watchClients ? "Voulez-vous vraiment supprimer cet utilisateur ?" : "Voulez-vous vraiment supprimer cet administrateur"}/>

            <div className="admin-accounts__left">
                <div className="left__account-list">

                    <div className="left__icons">
                        <FontAwesomeIcon
                            icon={faUser}
                            onClick={() => setWatchClients(true)}
                        />
                        <FontAwesomeIcon
                            icon={faUserCog}
                            onClick={() => setWatchClients(false)}
                        />
                    </div>

                    <AccountList
                        watchClients={watchClients}
                        accountList={watchClients ? clientAccountList : adminAccountList}
                        onClickClientAccount={onClickClientAccount}
                        onClickAdminAccount={onClickAdminAccount}
                        onClickDelete={onClickDeleteAccount}
                    />

                </div>
            </div>
            <div className="admin-accounts__right">
                <div className="right__content">
                    <div className="btn">
                        <button onClick={resetValues}>Nouvel Utilisateur</button>
                    </div>
                        
                    <form className="right__content__form" onSubmit={onSubmit}>

                        { create &&

                            <div className="right__content__form__radio" onChange={handleAdminChange}>
                                <span>Admin ?</span>
                                <input
                                    type="radio"
                                    value="Non"
                                    name="admin"
                                    id="n"
                                    checked={admin === false}
                                    readOnly
                                />
                                <label htmlFor="n">Non</label>
                                <input
                                    type="radio" 
                                    value="Oui"
                                    name="admin"
                                    id="y"
                                    checked={admin === true}
                                    readOnly
                                />
                                <label htmlFor="y">Oui</label>
                            </div>
                        }

                        { admin ?

                            <div className="admin-form">

                                <InputText
                                    value={username}
                                    placeholder="Nom d'utilisateur*"
                                    handleChange={handleUsername}
                                    readOnly={create ? false : true}
                                />
                                
                                <InputText
                                    value={password}
                                    placeholder={create ? "Mot de passe*" : "Changer mot de passe"}
                                    required={create ? true : false}
                                    handleChange={handlePassword}
                                />
                                
                                <InputButton value={create? "Créer" : "Enregistrer"} type="submit"/>
                            </div>
                        
                        :
                            
                            <div className="admin-form">

                                <InputText
                                    value={username}
                                    placeholder="Nom d'utilisateur*"
                                    handleChange={handleUsername}
                                    readOnly={create ? false : true}
                                />
                                <InputText
                                    value={password}
                                    placeholder={create ? "Mot de passe*" : "Changer mot de passe"}
                                    required={create ? true : false}
                                    handleChange={handlePassword}
                                />

                               
                                <InputEmail
                                    value={email}
                                    placeholder="Email*"
                                    handleChange={handleEmail}
                                />  
 

                                <InputText
                                    value={name}
                                    placeholder="Nom*"
                                    handleChange={handleName}
                                />

                                <InputText
                                    value={firstname}
                                    placeholder="Prénom*"
                                    handleChange={handleFirstname}
                                />

                                <InputNumber
                                    value={tel}
                                    placeholder="Tel"
                                    required={false}
                                    handleChange={handleTel}
                                />
                               
                                <InputButton value={create? "Créer" : "Enregistrer"} type="submit"/>
                            </div>

                        }

                    </form>
                        
                </div>
            </div>
        </div>
    );
}

export default AdminAccounts;