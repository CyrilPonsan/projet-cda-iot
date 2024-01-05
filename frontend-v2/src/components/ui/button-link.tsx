import { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  path: string;
};

const ButtonLink: FC<Props> = ({ label, path }) => {
  return (
    <Link
      className="w-5/6 btn btn-primary hover:none text-xs capitalize"
      to={path}
    >
      {label}
    </Link>
  );
};

export default ButtonLink;
