import { Trash2 } from "lucide-react";
import { FC } from "react";

type Props = {
  onDelete: () => void;
};

const DeleteButton: FC<Props> = ({ onDelete }) => {
  return (
    <button className="btn btn-warning btn-circle" onClick={onDelete}>
      <Trash2 />
    </button>
  );
};

export default DeleteButton;
