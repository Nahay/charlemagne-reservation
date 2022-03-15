import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig, userConfig } from './config';
 
const API_URL = process.env.REACT_APP_API_URL;


// GET ---------------------------------------------------------------------------------------------------------------------------------------

const getUsers = async(token) => {
    try {
        const { data } = await axios.get(API_URL + "/users", adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
}

const getVisibleUsers = async(token) => {
    try {
        const { data } = await axios.get(API_URL + "/users/visible", adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
}

const getUserByEmail = async (email, token) => {
    try {
        const { data } = await axios.get(API_URL + "/users/user/" + email, adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
}

const getFirstNameByEmail = async (email) => {
    try {
        const { data } = await axios.get(API_URL + "/users/firstname/" + email);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
}

const getUserById = async (id) => {
    try {
        const {data} = await axios.get(API_URL + "/users/" + id);
        return data;
    } catch (err) { 
        toast.error(err.message);
    }
}

// CREATE ---------------------------------------------------------------------------------------------------------------------------------------

const createUser = async (email, password, name, firstname, tel, token) => {
    try {
        await axios.post(API_URL + "/users", { email, password, name, firstname, tel }, adminConfig(token));
        toast.success("L'utilisateur a été crée !");
    } catch(err) {
        toast.error(err.message);
    }
}
// UPDATE -----------------------------------------------------------------------------------------------------------------------------------

const updateUser = async (id, password, name, firstname, tel, comment, admin, token) => {
    try {
        await axios.patch(API_URL + "/users/" +id, { password, name, firstname, tel, comment, admin }, admin ? adminConfig(token) : userConfig(token));
        toast.success("L'utilisateur a été mis à jour !");
    } catch(err) {
        toast.error(err.message);
    }
}

const updateUserNoPw = async (id, name, firstname, tel, comment, admin, token) => {
    try {
        await axios.patch(API_URL + "/users/usernpw/" +id, { name, firstname, tel, comment, admin }, admin ? adminConfig(token) : userConfig(token));
        toast.success("L'utilisateur a été mis à jour !");
    } catch(err) {
        toast.error(err.message);
    }
}

const hideUser = async (id, token) => {
    try {
        await axios.patch(API_URL + "/users/hide/" +id, {visible: false}, adminConfig(token));
        toast.success("L'utilisateur a été supprimé !");
    } catch(err) {
        console.log(err)
        toast.error(err.message);
    }
}

// DELETE ---------------------------------------------------------------------------------------------------------------------------------------

const deleteUser = async (id, token) => {
    try {
        await axios.delete(API_URL + "/users/" +id, adminConfig(token));
        toast.success("L'utilisateur a été supprimé !");
    } catch(err) {
        console.log(err);
        toast.error(err.message);
    }
}

const deleteUserByEmail = async (email, token) => {
    try {
        await axios.delete(API_URL + "/users/user/" +email, adminConfig(token));
        toast.success("L'utilisateur a été supprimé !");
    } catch(err) {
        console.log(err);
        toast.error(err.message);
    }
}

// SIGN IN ------------------------------------------------------------------------------------------------------------------------------------

const userSignIn = async (email, password) => {
    try {
        const { data } = await axios.post(API_URL + "/users/signin", { email, password });
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

// SIGN UP ------------------------------------------------------------------------------------------------------------------------------------

const userSignUp = async (email, password, name, firstname, tel, comment) => {
    try {
        const { data } = await axios.post(API_URL + "/users/signup", { email, password, name, firstname, tel, comment });
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};


export {
    userSignIn,
    userSignUp,
    getUserByEmail,
    getFirstNameByEmail,
    getUserById,
    getUsers,
    getVisibleUsers,
    createUser,
    hideUser,
    updateUser,
    updateUserNoPw,
    deleteUser,
    deleteUserByEmail
}