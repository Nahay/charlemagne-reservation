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
<<<<<<< HEAD
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
      
=======
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
>>>>>>> 6bde6a5e5e269ac43f54aed5c38e0e00be4e2c79
      }
      
    </div>
  );
};

export default InputEmail;
