import React, { FC } from "react";
import TrashIcon from "./svg/trash-icons";

type Props = {
  onDelete: () => void;
};

const DeleteButton: FC<Props> = ({ onDelete }) => {
  return (
    <button className="btn btn-secondary btn-circle" onClick={onDelete}>
      <div className="text-white">
        <TrashIcon />
      </div>
    </button>
  );
};

export default DeleteButton;
