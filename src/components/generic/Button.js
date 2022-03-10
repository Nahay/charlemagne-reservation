import React from "react";
import { Link } from "react-router-dom";


const Button = ({link, name}) => {

  return (
    <div className="btn">
      <Link to={link}>
        {name}
      </Link>
    </div>
  );
}

export default Button;