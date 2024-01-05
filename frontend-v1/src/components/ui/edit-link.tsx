import { FC } from "react";
import { Link } from "react-router-dom";

import EditIcon from "./svg/edit-icon";

type Props = {
  id: string;
};

const EditLink: FC<Props> = ({ id }) => {
  return (
    <Link
      className="btn btn-primary btn-circle"
      to={`/capteurs/details/${id}/edit`}
    >
      <EditIcon />
    </Link>
  );
};

export default EditLink;
