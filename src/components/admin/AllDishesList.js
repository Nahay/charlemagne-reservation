import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const AllDishesList = ({dishList, invisible, onClickDish, onClickDelete, onClickInvisible}) => {

  return (
    <div className="list__container">
    {dishList.map((d) => {
          return (
            <div className="list__container__box" key={d.name}>
              <p onClick={() => onClickDish(d)}>
                {d.name}
              </p>

              {invisible ?
                <div className="icon-delete" onClick={() => onClickInvisible(d._id)}>
                  <FontAwesomeIcon icon={faEye} size="sm"/>
                </div>
              :
                <div className="icon-delete" onClick={() => onClickDelete(d._id)}>
                  <FontAwesomeIcon icon={faTrashAlt} size="sm"/>
                </div>
              }
              
            </div>
          );
    })}
  </div>
   );
}

export default AllDishesList;