import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import moment from "moment";
import "moment/locale/fr";
import { decodeToken } from 'react-jwt';
import { toast } from 'react-toastify';

import Table from '../order/Table';


const DayDetails = ({date, dishByDateList}) => {

    const [isAvailable, setIsAvailable] = useState(false);
    const [haveDesc, setHaveDesc] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {

        async function getNb() {
            setIsAvailable(false);
            setHaveDesc(false);
            dishByDateList.forEach(d => {
                if (d.numberRemaining > 0) setIsAvailable(true);
                if (d.idDish.description !== "") setHaveDesc(true);
            });
        }
        
        async function getUser() {
            const userDecoded = decodeToken(localStorage.getItem("userToken"));
            if (userDecoded) { setIsLogged(true) }
        }
        
        getUser();
        getNb();
    
    }, [dishByDateList]);


    return ( 
        <div className="day-details">
            <h1 className="day-details__title">{moment(date).locale('fr').format('LL')}</h1>
            <Table dishByDateList={dishByDateList}/>
            
            { isAvailable &&

            <>
                { haveDesc &&
                    <div className="right__tip">
                        <p>Passez la souris sur le nom du plat pour avoir sa description.</p>
                    </div>
                }

                <div className="day-details__button">
                    <div className="btn">
                        { isLogged ? 
                            <Link to={`passer-reservation/${date}`} onClick={() => localStorage.removeItem('date')}>
                                Réserver
                            </Link> 
                            :
                            <Link to={"connexion"} onClick={() => toast.error("Veuillez vous connecter avant de passer commande !")}>
                                Réserver
                            </Link> 
                        }                    
                    </div>
                </div>
            </>

            }
            
        </div>
     );
}

export default DayDetails;