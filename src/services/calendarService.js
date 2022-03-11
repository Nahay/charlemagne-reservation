import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig } from './config';
 
const API_URL = process.env.REACT_APP_API_URL;


const createDate = async (dateC, visibility, comment, nbPlaces, token) => {
    try {
        await axios.post(API_URL + "/calendar", {
            dateC,
            visibility,
            comment, 
            nbPlaces
        }, adminConfig(token));
        toast.success("La date a été créée !");

    } catch(err) {
        toast.error(err.message);
    }
};

const getDates = async () => {
    try {
        const { data } = await axios.get(API_URL + "/calendar");
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getDateByDate = async (date) => {
    try {
        const { data } = await axios.get(API_URL + "/calendar/date/" +date);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getDatesByVisibility = async () => {
    try {
        const { data } = await axios.get(API_URL + "/calendar/visibility");
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getDateById = async (id) => {
    try {
        const { data } = await axios.get(API_URL + "/calendar/" +id);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const updateDate = async (date, visibility, comment, nbPlaces, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/" +date, {
                visibility,
                comment,
                nbPlaces
            }, adminConfig(token)
        );
        toast.success("La date a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const updateDateNbR = async (nbRemaining, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/nbR/" +date, {
                nbRemaining
            }, adminConfig(token)
        );
        toast.success("La date a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const deleteDate = async (date, token) => {
    try {
        await axios.delete(API_URL + "/calendar/" +date, adminConfig(token));
        toast.success("Cette date a été supprimée !");
    } catch(err) {
        toast.error(err.message);
    }
};

const addDishToDate = async (date, dishID, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/dish/" +date, {
                dishID
            }, adminConfig(token)
        );
        toast.success("Le plat a été ajouté à la date !");
    } catch(err) {
        toast.error(err.message);
    }
};

const DelDishFromDate = async (date, dishID, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/del-dish/" +date, {
                dishID
            }, adminConfig(token)
        );
        toast.success("Le plat a été supprimé de la date !");
    } catch(err) {
        toast.error(err.message);
    }
};


export {
    createDate,
    getDates,
    getDateByDate,
    getDateById,
    getDatesByVisibility,
    updateDate,
    deleteDate,
    updateDateNbR,
    addDishToDate,
    DelDishFromDate
};