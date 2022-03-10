import React, { useEffect, useState } from 'react';
import BackgroundSlider from 'react-background-slider';

import Button from '../components/generic/Button';
import Time from '../components/generic/Time';

import { getParam } from '../services/paramsService';


const Home = () => {

    const imgList = [
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00014-800x400.jpg",
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00017-Copie-800x400.jpg",
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00102-800x400.jpg",
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00021-800x400.jpg",
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00003-800x400.jpg",
        "https://lycee-charlespointet-thann.fr/wp-content/uploads/2018/12/DSC00040-Copie-800x400.jpg"
    ]


    const [welcomeMess, setWelcomeMess] = useState("");

    
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
                
                <Button name = "Commander" link = "/commander"/>
            </div>
            <div className = "home__right">
                <Time/>
            </div>
        </div>
    );
}
 
export default Home;