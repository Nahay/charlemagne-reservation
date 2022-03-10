import React from "react";


const InputPassword = ({value, placeholder, required, handleChange}) => {

  if (value === undefined) value="";
  if (required === undefined) required = true;

  return (
    <div className={"input"}>

      {required ?

      <input
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        required
      />

      :

      <input
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
      />
      
      }
    </div>
  );
};

export default InputPassword;
