import axios from 'axios';
import { toast } from 'react-toastify';
import { adminConfig } from './config';
 
const API_URL = process.env.REACT_APP_API_URL;


// DISHES

const createDish = async (name, description, type, token) => {
    try {
        const { data } = await axios.post(API_URL + "/dishes", {
            name,
            description,
            type
        }
        , adminConfig(token));
        toast.success(`Le plat ${data.name} a été créé !`);

    } catch(err) {
        toast.error(err.message);
    }
};

const getDishes = async () => {
    try {
        const { data } = await axios.get(API_URL + "/dishes/visible");
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getInvisibleDishes = async () => {
    try {
        const { data } = await axios.get(API_URL + "/dishes/invisible");
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getDishByName = async (name) => {
    try {
        const { data } = await axios.get(API_URL + "/dishes/name/" +name);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getDishById = async (id) => {
    try {
        const { data } = await axios.get(API_URL + "/dishes/" +id);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const getCountByName = async (name) => {
    try {
        const { data } = await axios.get(API_URL + "/dishes/findname/" +name);
        return data;
    } catch(err) {
        toast.error(err.message);
    }
};

const updateDish = async (id, name, desc, type, token) => {
    try {
        const { data } = await axios.patch(
        API_URL + "/dishes/" +id, {
            name: name,
            description : desc,
            type: type,
        }
        , adminConfig(token));
        if (data.modifiedCount > 0) toast.success(`Le plat a été mis à jour !`);
    }
    catch(err) {
        toast.error(err.message);
    }
}

const hideDish = async (id, token) => {
    try {
        const { data } = await axios.patch(API_URL + "/dishes/hide/" +id, {}, adminConfig(token));
        toast.success(`Le plat ${data.name} n'est plus visible !`);
        return data.type;
    }
    catch(err) {
        toast.error(err.message);
    }
}

const unhideDish = async (id, token) => {
    try {
        const { data } = await axios.patch(API_URL + "/dishes/unhide/" +id, {}, adminConfig(token));
        toast.success(`Le plat ${data.name} est à nouveau visible !`);
        return data.type;
    }
    catch(err) {
        toast.error({err});
    }
}


export {
    createDish,
    updateDish,
    getDishById,
    getDishByName,
    getCountByName,
    getDishes,
    hideDish,
    getInvisibleDishes,
    unhideDish
};