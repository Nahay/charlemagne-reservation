import React from "react";
import Calendar from "react-calendar";


const AdminCalendar = ({dateList, rightRef, onChangeDate}) => {

    const executeScroll = () => {
        rightRef.current.scrollIntoView({ 
           behavior: "smooth", 
           block: "nearest"
        })
    }
    
    const tileClassName = ({ date }) => {
        // pour toutes les dates affichées dans le mois actuel
        if (dateList.find((x) => x.dateC === date.getTime())) {
          return "highlight";
        }
    };

    return ( 
        <Calendar
            onChange={(e) => onChangeDate(e.getTime())}
            tileClassName={tileClassName}
            onClickDay={executeScroll}
        />
     );
}

export default AdminCalendar;