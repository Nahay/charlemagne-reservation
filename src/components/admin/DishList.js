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
                <p>{d.name}</p>
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