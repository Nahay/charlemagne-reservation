import React from "react";


const Counter = ({ value, handleChange, onClickPlus, onClickMinus }) => {

    return (
        <div className="counter__content">
            
            <input type="text" value={value} onChange={handleChange} placeholder="0"/>
            <div className="buttons">
                <button type="button" onClick={onClickPlus} >+</button>
                <button type="button" onClick={onClickMinus}>-</button>
            </div>

        </div>
    );
}

export default Counter;