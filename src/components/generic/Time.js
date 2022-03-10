import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment/locale/fr'


const Time = () => {

    const [time, setTime] = useState(moment(new Date()).locale('fr').format('LTS'));
    const day = moment(new Date()).locale('fr').format('L');

    useEffect(() => {
        let timer = setInterval(() => {
            setTime(moment(new Date()).locale('fr').format('LTS'));
        }, 1000);
        return () => {
            clearInterval(timer);
        }
    }, []);

    return (
            <div className="time">
                <p>{time}</p>
                <p>{day}</p>
            </div>
    );
}

export default Time;