import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import moment from "moment";
import "moment/locale/fr";

import Table from '../order/Table';


const DayDetails = ({date, dishByDateList, nbR}) => {

    const [isAvailable, setIsAvailable] = useState(false);
    const [haveDesc, setHaveDesc] = useState(false);

    useEffect(() => {

        async function getNb() {
            setIsAvailable(false);
            setHaveDesc(false);
            
            dishByDateList.forEach(d => {
                if (nbR > 0 && nbR !== "") setIsAvailable(true);
                if (d.description !== "") setHaveDesc(true);
            });
        }

        getNb();
    
    }, [dishByDateList, nbR]);


    return ( 
        <div className="day-details">
            <h1 className="day-details__title">{moment(date).locale('fr').format('LL')}</h1>

            { isAvailable &&
                <div className="right__places-available">
                    <p>Places disponibles : {nbR}</p>
                </div>
            }

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
                        <Link to={`passer-reservation/${date}`} onClick={() => localStorage.removeItem('date')}>
                            Réserver
                        </Link>               
                    </div>
                </div>
            </>

            }
            
        </div>
     );
}

export default DayDetails;