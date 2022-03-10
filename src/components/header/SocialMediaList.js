import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";


const SocialMediaList = () => {

  return (
    <div className="social-media-list">
      <a
        href="https://www.facebook.com/LyceeCharlesPointet/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
      <a
        href="http://lycee-charlespointet-thann.fr/"
        target="_blank"
        rel="noopener noreferrer"
      >
        www
      </a>
    </div>
  );
};

export default SocialMediaList;
