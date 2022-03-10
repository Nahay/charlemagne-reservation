import React from "react";


const InputNumber = ({value, placeholder, required, handleChange}) => {

  if (value === undefined) value="";
  if (required === undefined) required = true;

  return (
    <div className={"input input-tel"}>

      {required ?

      <input
        type="tel"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        required
      />

      :

      <input
        type="tel"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
      />
      
      }
    </div>
  );
};

export default InputNumber;
