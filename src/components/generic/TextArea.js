import React from "react";


const TextArea = ({value, placeholder, id, required, handleChange}) => {

  if (value === undefined) value = "";
  if (required === undefined) required = true;

  return (
    <div className={"textarea"}>
      
      {required ?
      
      <textarea
      value={value}
      placeholder={placeholder} 
      id={id}
      onChange={(e) => { handleChange(e) }}
      name={id}
      required
      />

      :
      
      <textarea
      value={value}
      placeholder={placeholder} 
      id={id}
      onChange={(e) => { handleChange(e) }}
      name={id}
      />

      }
      
    </div>
  );
};

export default TextArea;
