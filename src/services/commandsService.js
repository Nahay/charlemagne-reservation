import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig, userConfig } from './config';

const API_URL = process.env.REACT_APP_API_URL;


const createCommand = async (user, name, tel, dateC, nbPlaces, comment, total, token) => {
    try {
        const { data } = await axios.post(API_URL + "/commands", {
            user,
            name, 
            tel,
            dateC,
            nbPlaces,
            comment,
            total
        }, userConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const createCommandNL = async (name, tel, dateC, nbPlaces, comment, total) => {
    try {
        const { data } = await axios.post(API_URL + "/commands/nl", {
            name, 
            tel,
            dateC,
            nbPlaces,
            comment,
            total
        });
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommands = async (token) => {
    try {
        const { data } = await axios.get(API_URL + "/commands", adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandById = async (id, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commands/id/" +id, adminConfig(token));
        return data;

    } catch(err) {
        toast.error(err.message);
    }

}

const getCommandByDate = async (dateC, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commands/" +dateC, adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandByUser = async (user, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commands/user/" + user, userConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const updateCommand = async (id, nbPlaces, comment, total, token) => {
    try {
        await axios.patch(
            API_URL + "/commands/" +id, {
                nbPlaces,
                comment,
                total
            }, adminConfig(token)
        );
        toast.success("La réservation a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const deleteCommand = async (id, token) => {
    try {
        await axios.delete(API_URL + "/commands/" +id, adminConfig(token));
        toast.success("La réservation a été supprimée !");
    } catch(err) {
        toast.error(err.message);
    }
};


export {
    createCommand,
    createCommandNL,
    getCommands,
    getCommandById,
    getCommandByDate,
    getCommandByUser,
    updateCommand,
    deleteCommand
};