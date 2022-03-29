import React, { useEffect, useState } from 'react';
import BackgroundSlider from 'react-background-slider';

import Button from '../components/generic/Button';
import Time from '../components/generic/Time';
import * as img from '../assets/index';

import { getParam } from '../services/paramsService';


const Home = () => {

    const [welcomeMess, setWelcomeMess] = useState("");
    
    const imgList = Object.values(img);
    
    useEffect(() => {
        getSetMess();
    }, []);
    
    const getSetMess = async () => {
        const mess = await getParam("welcome");
        setWelcomeMess(mess);
    }

    return (
        <div className="home">
            <BackgroundSlider images={imgList} duration={4} transition={1}/>
            <div className = "home__left">
                <h1>Bienvenue<br/>au restaurant<br/>Le Charlemagne</h1>

                <p className = "home__subtitle" id = "home__subtitle">{welcomeMess}</p>
                
                <Button name = "Réserver" link = "/reserver"/>
            </div>
            <div className = "home__right">
                <Time/>
            </div>
        </div>
    );
}
 
export default Home;