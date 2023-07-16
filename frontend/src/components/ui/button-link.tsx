import React, { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  path: string;
};

const ButtonLink: FC<Props> = ({ label, path }) => {
  return (
    <Link className="w-fit btn btn-secondary hover:none text-xs" to={path}>
      {label}
    </Link>
  );
};

export default ButtonLink;
