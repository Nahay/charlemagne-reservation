import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


const CommandsList = ({commandsListByDate, onClickCommand, onClickDelete}) => {

  return (
    <div className="list__container">
    {commandsListByDate.map((d) => {
          return (
            <div className="list__container__box" key={d._id} >
              <div className="infos-commands" onClick={() => onClickCommand(d)}>
                <p>{d.user.name} </p>
                <p> {d.user.firstname} </p>
                <p>{d.timeC}</p>
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

export default CommandsList;