import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const CommandsList = ({commandsListByDate, onClickCommand, onClickDelete}) => {

  return (
    <div className="list__container">
    {commandsListByDate.map((c) => {
          return (
            <div className="list__container__box" key={c._id} >
              <div className="infos-commands" onClick={() => onClickCommand(c)}>
                <p>{c.name} </p>
                <p>{c.nbP}</p>
              </div>
              <div className="icon-delete" onClick={() => onClickDelete(c._id)}>
                <FontAwesomeIcon icon={faTrashAlt} size="sm"/>
              </div>
            </div>
          );
    })}
  </div>
   );
}

export default CommandsList;