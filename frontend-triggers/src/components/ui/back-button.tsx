import { FC } from "react";

import { useNavigate } from "react-router-dom";
import PreviousIcon from "./svg/previous-icon";

type Props = {
  url?: string;
};

const BackButton: FC<Props> = ({ url = ".." }) => {
  const nav = useNavigate();

  const handleNavBack = () => {
    nav(url);
  };

  return (
    <button
      className="btn btn-sm btn-primary btn-circle"
      onClick={handleNavBack}
    >
      <PreviousIcon />
    </button>
  );
};

export default BackButton;
