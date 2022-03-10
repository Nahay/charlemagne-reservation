import React, {useState, useEffect} from 'react';

import InputButton from '../../components/generic/InputButton';
import TextArea from '../../components/generic/TextArea';

import { getParam, updateParam } from '../../services/paramsService';


const AdminHome = () => {

    const [welcomeMess, setWelcomeMess] = useState("");
    const [orderInfo, setOrderInfo] = useState("");

    const token = localStorage.getItem("adminToken");

    
    useEffect(() => {
        getSetMess();
        getSetOrderInfo();
    }, []);
    
    const getSetMess = async () => {
        const mess = await getParam("welcome");
        setWelcomeMess(mess);
    }

    const getSetOrderInfo = async () => {
        const orderMess = await getParam("order");
        setOrderInfo(orderMess);
    }


    // HANDLE ---------------------------------------------------------------

    const handleWelcomeMessage = (e) => setWelcomeMess(e.target.value)

    const handleOrderInfo = (e) => setOrderInfo(e.target.value)


    // DB -------------------------------------------------------------------

    const onWelcomeMessageSubmit = (e) => {
        e.preventDefault();
        updateParam("welcome",welcomeMess, token);
    }

    const onOrderInfoSubmit = (e) => {
        e.preventDefault();
        updateParam("order",orderInfo, token);
    }


    // RENDER ---------------------------------------------------------------

    return (
        <div className="admin-home">            
            <div className="admin-home__container">
                <div className="container__inputs">
                    <form className="container__inputs__1" onSubmit={onWelcomeMessageSubmit}>
                        <p>Phrase de bienvenue :</p>
                        <TextArea
                            value={welcomeMess}
                            placeholder=""
                            required = {false}
                            handleChange={handleWelcomeMessage}
                        />
                        <InputButton value="Changer" type="submit"/>
                    </form>
                    <form className="container__inputs__2" onSubmit={onOrderInfoSubmit}>
                        <p>Informations des pages de commandes :</p>
                        <TextArea
                            value={orderInfo}
                            placeholder=""
                            required = {false}
                            handleChange={handleOrderInfo}
                        />
                        <InputButton value="Changer" type="submit"/>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;