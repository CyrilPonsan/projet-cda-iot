import React, { FC } from "react";

import Lien from "../../utils/types/lien";
import IconWrapper from "./icon-wrapper";
import { Link } from "react-router-dom";

type Props = {
  listeLiens: Array<Lien>;
};

const ListeLiens: FC<Props> = ({ listeLiens }) => {
  return (
    <ul className="flex flex-col gap-y-6 mt-8">
      {listeLiens.map((item: Lien) => (
        <li key={item.id}>
          <Link
            to={item.path}
            className="w-fit text-3xl text-base-content hover:underline decorationt-base-content/50 cursor-pointer flex gap-x-6 items-center hover:brightness-75"
          >
            <IconWrapper padding={4}>{item.icon}</IconWrapper>
            <p>{item.label}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListeLiens;
