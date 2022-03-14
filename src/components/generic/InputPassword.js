import React, { useState } from "react";

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const InputPassword = ({value, placeholder, required, handleChange}) => {

  const [eye, setEye] = useState(true);


  if (value === undefined) value="";
  if (required === undefined) required = true;

  return (
    <div className={"input input-password"}>

      {required ?

      <input
        type= { eye ? "password" : "text" }
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
        required
      />

      :

      <input
        type= { eye ? "password" : "text" }
        value={value}
        placeholder={placeholder}
        onChange={(e) => handleChange(e) }
      />
      
      }

      { eye ?
        <FontAwesomeIcon icon={faEye} size="lg" onClick={() => setEye(false)}/>
      :
        <FontAwesomeIcon icon={faEyeSlash} size="lg" onClick={() => setEye(true)}/>
      }
      
    </div>
  );
};

export default InputPassword;
