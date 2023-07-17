import React, { FC } from "react";
import TrashIcon from "./svg/trash-icons";

type Props = {
  onDelete: () => void;
};

const DeleteButton: FC<Props> = ({ onDelete }) => {
  return (
    <button className="btn btn-warning btn-circle" onClick={onDelete}>
      <TrashIcon />
    </button>
  );
};

export default DeleteButton;
