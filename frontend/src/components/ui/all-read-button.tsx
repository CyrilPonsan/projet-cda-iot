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
      <div className="text-success">
        <CheckedIcon size="xs" />
      </div>
      <p className="text-xs lowercase">Marquer comme lus</p>
    </button>
  );
};

export default AllReadButton;
