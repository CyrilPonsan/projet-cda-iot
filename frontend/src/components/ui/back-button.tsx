import React from "react";

import { useNavigate } from "react-router-dom";
import PreviousIcon from "./svg/previous-icon";

const BackButton = () => {
  const nav = useNavigate();

  const handleNavBack = () => {
    nav("..");
  };

  return (
    <button className="btn btn-secondary btn-circle" onClick={handleNavBack}>
      <PreviousIcon />
    </button>
  );
};

export default BackButton;
