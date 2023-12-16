import { FC } from "react";

import CheckedIcon from "./svg/checked-icon";

type Props = {
  onClickEvent: () => void;
};

const AllReadButton: FC<Props> = ({ onClickEvent }) => {
  return (
    <button
      className="btn btn-sm btn-outline flex items-center gap-x-2 border-primary text-primary hover:bg-transparent hover:text-primary "
      onClick={onClickEvent}
    >
      <CheckedIcon />
      <p className="text-xs lowercase">Marquer comme lus</p>
    </button>
  );
};

export default AllReadButton;
