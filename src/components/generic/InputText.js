import React from "react";


const InputText = ({value, placeholder, required, handleChange, readOnly}) => {

  if (value === undefined) value="";
  if (required === undefined) required = true;

  return (
    <div className={"input"}>

      {required ?
      readOnly ?
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        required
        readOnly
      />
      :
        <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        required
      />
      :
        readOnly ?
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        readOnly
      />
      :
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
      />
      
      }
    </div>
  );
};

export default InputText;
