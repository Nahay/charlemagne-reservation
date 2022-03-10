import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const DishList = ({dishByDateList, onClickDish, onClickDelete}) => {

  return (
    <div className="list__container">
    {dishByDateList.map((d) => {
          return (
            <div className="list__container__box" key={d._id} >
              <div className="infos-dish" onClick={() => onClickDish(d)}>
                <p>{d.idDish.name}</p>
                <div className="nb-dish">
                  <span>Nb cuisine : {d.numberKitchen}</span>
                  <span>Nb Dispo : {d.numberRemaining}</span>
                </div>
              </div>
              <div className="icon-delete" onClick={() => onClickDelete(d)}>
                <FontAwesomeIcon icon={faTrashAlt} size="sm"/>
              </div>
            </div>
          );
    })}
  </div>
   );
}

export default DishList;