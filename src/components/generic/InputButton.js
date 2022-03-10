import React from "react";


const InputButton = ({value, type, onClick}) => {

  return (
    <div className="input-btn" >
      <input type={type} value={value} onClick={onClick}/>
    </div>
  );
};

export default InputButton;