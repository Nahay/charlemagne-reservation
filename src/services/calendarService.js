import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig, userConfig } from './config';
import FileDownload from 'js-file-download';

const API_URL = process.env.REACT_APP_API_URL;


const createDate = async (dateC, visibility, comment, price, nbPlaces, token) => {
    try {
        await axios.post(API_URL + "/calendar", {
            dateC,
            visibility,
            comment, 
            price,
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

const downloadExcel = async () => {
    try { 
        await axios.get(API_URL + "/calendar/download", { responseType: 'arraybuffer' }).then(response => { 
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            FileDownload(blob, "file.xlsx");
        });
    } catch(err) {
        toast.error(err.message);
    }
}

const updateDate = async (date, visibility, comment, price, nbPlaces, nbRemaining, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/" +date, {
                visibility,
                comment,
                price,
                nbPlaces,
                nbRemaining
            }, adminConfig(token)
        );
        toast.success("La date a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const updateDateNbR = async (date, nbRemaining, admin, token) => {
    try {
        await axios.patch(
            API_URL + "/calendar/nbR/"+date, {
                admin,
                nbRemaining
            }, admin ? adminConfig(token) : userConfig(token)
        );
        admin && toast.success("La date a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const updateDateNbRNL = async (date, nbRemaining) => {
    try {
        await axios.patch(
            API_URL + "/calendar/nbR-nl/"+date, {
                nbRemaining
            });
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

const delDishFromDate = async (date, dishID, token) => {
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
    downloadExcel,
    getDateByDate,
    getDatesByVisibility,
    updateDate,
    deleteDate,
    updateDateNbR,
    updateDateNbRNL,
    addDishToDate,
    delDishFromDate
};