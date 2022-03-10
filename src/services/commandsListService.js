import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig, userConfig } from './config';

const API_URL = process.env.REACT_APP_API_URL;


const createCommandList = async (command, dishID, quantity, token) => {
    try {
        await axios.post(API_URL + "/commandsList", {
            command,
            dishID,
            quantity
        }, userConfig(token));
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandsList = async (token) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList", adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandListById = async (id, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList/" +id, adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandListByCommand = async (commandID) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList/command/" +commandID);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCommandListByCommandWithDish = async (commandID, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList/commandAndDish/" +commandID, userConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getOneCommandListByDish = async (dishID, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList/dish/" +dishID, adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getOneCommandListByDate = async (date, token) => {
    try {
        const { data } = await axios.get(API_URL + "/commandsList/date/" +date, adminConfig(token));
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const updateQuantity = async (id, quantity, token) => {
    try {
        await axios.patch(
            API_URL + "/commandsList/" +id, {
                quantity
            }, adminConfig(token)
        );
        toast.success("La quantité a été mise à jour !");
    } catch(err) {
        toast.error(err.message);
    }
};

const deleteCommandList = async (id, token) => {
    try {
        await axios.delete(API_URL + "/commandsList/" +id, adminConfig(token));
        toast.success("L'élement a été supprimé de la commande.");
    } catch(err) {
        toast.error(err.message);
    }
};

const deleteCommandListByCommand = async (commandID, token) => {
    try {
        await axios.delete(API_URL + "/commandsList/command/" +commandID, adminConfig(token));
        toast.success("L'élement a été supprimé de la commande.");
    } catch(err) {
        toast.error(err.message);
    }
};

const deleteAllCommandsList = async (commandID, token) => {
    try {
        await axios.delete(API_URL + "/commandsList/commands/" +commandID, adminConfig(token));
        toast.success("Les éléments ont été supprimés de la commande.");
    } catch(err) {
        toast.error(err.message);
    }
};

export {
    createCommandList,
    getCommandsList,
    getCommandListById,
    getCommandListByCommand,
    getCommandListByCommandWithDish,
    getOneCommandListByDish,
    updateQuantity,
    deleteCommandList,
    deleteAllCommandsList,
    deleteCommandListByCommand,
    getOneCommandListByDate
};