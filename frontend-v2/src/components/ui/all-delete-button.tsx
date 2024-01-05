import { Trash2 } from "lucide-react";
import { FC } from "react";


type Props = {
  onClickEvent: () => void;
};

const AllDeleteButton: FC<Props> = ({ onClickEvent }) => {
  return (
    <button
      className="btn btn-sm btn-outline flex items-center gap-x-2 border-primary text-primary hover:bg-transparent hover:text-primary"
      onClick={onClickEvent}
    >
      <Trash2 />
      <p className="text-xs lowercase">Supprimer</p>
    </button>
  );
};

export default AllDeleteButton;
