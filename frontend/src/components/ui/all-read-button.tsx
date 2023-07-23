import React, { FC } from "react";

import CheckedIcon from "./svg/checked-icon";

type Props = {
  onClickEvent: () => void;
};

const AllReadButton: FC<Props> = ({ onClickEvent }) => {
  return (
    <button
      className="btn btn-xs btn-outline flex items-center gap-x-2 border-primary text-primary hover:bg-transparent hover:text-primary"
      onClick={onClickEvent}
    >
      <CheckedIcon size="xs" />
      <p className="text-xs lowercase">Marquer comme lus</p>
    </button>
  );
};

export default AllReadButton;
