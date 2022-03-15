import React from "react";


const InputEmail = ({value, placeholder, required, handleChange, readOnly}) => {

  if (value === undefined) value="";
  if (required === undefined) required = true;
  if (readOnly === undefined) readOnly = false;
  return (
    <div className={"input"}>

      {required ?
      readOnly ?
        <input
          type="email"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e) }
          required
          readOnly
        />
      :
        <input
          type="email"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e) }
          required
        />
      :
        readOnly ?
        <input
          type="email"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e) }
          readOnly
        />
      :
        <input
          type="email"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e) }
        />
      }
      
    </div>
  );
};

export default InputEmail;
