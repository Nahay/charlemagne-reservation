import React from "react";

import InputButton from "./InputButton";


const DishBox = ({onClickConfirmation, dishBoxRef, dish}) => {
    return (
        <div className="dish-summary__container" ref={dishBoxRef}>
            {Object.keys(dish).length > 0 &&
                <div className="dish-summary-box__container">
                    <div className="dish-summary-box__content">

                        <div className="dish-name">{ dish.dishID.name }</div>
                        
                        <div className="dish-quantity-price">
                            <p>Quantité achetée : { dish.quantity }</p>
                            <p>Prix unitaire : { dish.dishID.price } €</p>
                        </div>

                        <div className="dish-description">{ dish.dishID.description }</div>
                        
                        <div className="dish-total">Total : { dish.dishID.price * dish.quantity } €</div>

                        <div className="content__buttons">

                            <InputButton type="button" value="Fermer" onClick={onClickConfirmation}/>

                        </div>

                    </div>
                </div>
            }

            <div className="dish-summary__background" onClick={onClickConfirmation}>
            </div>

        </div>
  );
}

export default DishBox;