import React from "react";
import moment from "moment";
import "moment/locale/fr";

const List = ({dateList, onDateChange, rightRef}) => {

  const executeScroll = () => {
    rightRef.current.scrollIntoView({ 
       behavior: "smooth",
       block: "nearest"
    })
  }

  const handleClick = (date) => {
    onDateChange(date);
    executeScroll();
  }

  return (
    <div className="list__container">

    {dateList.map((d, i) => {
      // déclaration de la date actuelle
      let todayMinusSeven = new Date(moment(new Date()).format("YYYY, MM, DD"));
      // transformation de la date en Jour - 2
      todayMinusSeven.setDate(todayMinusSeven.getDate() - 7);
      // déclare une nouvelle date sous le format int
      todayMinusSeven = todayMinusSeven.getTime();
      if (d.dateC >= todayMinusSeven) {
        return (
          <div className="list__container__box" key={d._id} onClick={() => handleClick(d.dateC)}>
            <p>{moment(d.dateC).locale("fr").format("LL")}</p>
            <span>Plats dispo : {d.nbR}</span>
          </div>
        );
      }
      return null;
    })}
    
  </div>
   );
}

export default List;