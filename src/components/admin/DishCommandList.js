import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const DishCommandList = ({ dishList, onClickDish, onClickDelete }) => {
  
  return (
    <div className="list__container">
    {dishList.map((d) => {
          return (
            <div className="list__container__box" key={d._id}> 
              <div className="infos-dish"  onClick={() => onClickDish(d)}>
                <p>{d.dishID.name}</p>
                <div className="dish__quantity">
                  <p>Quantité : {d.quantity}</p>
                </div>
              </div>
              <div className="icon-delete" onClick={() => onClickDelete(d._id)}>
                <FontAwesomeIcon icon={faTrashAlt} size="sm"/>
              </div>
            </div>
          );
    })}
  </div>
   );
}

export default DishCommandList;