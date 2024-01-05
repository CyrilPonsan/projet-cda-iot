import { FC } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

type Props = {
  id: number;
};

const EditLink: FC<Props> = ({ id }) => {
  return (
    <Link
      className="btn btn-primary btn-circle"
      to={`/capteurs/details/${id}/edit`}
    >
      <Pencil />
    </Link>
  );
};

export default EditLink;
