import { FC } from "react";

import Lien from "../../utils/types/lien";
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
            <div className="btn btn-circle btn-primary no-animation">
              {item.icon}
            </div>
            <p>{item.label}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ListeLiens;
