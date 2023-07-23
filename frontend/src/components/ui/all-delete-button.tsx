import React, { FC } from "react";

import TrashIcon from "./svg/trash-icons";

type Props = {
  onClickEvent: () => void;
};

const AllDeleteButton: FC<Props> = ({ onClickEvent }) => {
  return (
    <button
      className="btn btn-xs btn-outline flex items-center gap-x-2 border-primary text-primary hover:bg-transparent hover:text-primary"
      onClick={onClickEvent}
    >
      <div className="text-error">
        <TrashIcon size="xs" />
      </div>
      <p className="text-xs lowercase">Supprimer</p>
    </button>
  );
};

export default AllDeleteButton;
