import { CheckCircle } from "lucide-react";
import { FC } from "react";

type Props = {
  onClickEvent: () => void;
};

const AllReadButton: FC<Props> = ({ onClickEvent }) => {
  return (
    <button
      className="btn btn-sm btn-outline flex items-center gap-x-2 border-primary text-primary hover:bg-transparent hover:text-primary "
      onClick={onClickEvent}
    >
      <CheckCircle />
      <p className="text-xs lowercase">Marquer comme lus</p>
    </button>
  );
};

export default AllReadButton;
