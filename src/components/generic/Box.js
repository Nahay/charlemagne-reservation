import React from "react";
import InputButton from "./InputButton";

const Box = ({onClickConfirmation, onClickDelete, boxRef, message}) => {

  return (
    <div className="confirmation__container" ref={boxRef}>      
        <div className="confirmation-box__container">
            <div className="confirmation-box__content">

                <p>{message}</p>

                <div className="content__buttons">

                    <InputButton type="button" value="Annuler" onClick={onClickConfirmation}/>
                    <InputButton type="button" value="Supprimer" onClick={onClickDelete} />

                </div>

            </div>

        </div>

        <div className="confirmation__background" onClick={onClickConfirmation}>
        </div>

    </div>
  );
}

export default Box;