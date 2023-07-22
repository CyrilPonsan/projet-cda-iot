import React, { FC } from "react";

import Alerte from "../utils/types/alerte";
import WarningIcon from "./ui/svg/warning-icon";

type Props = {
  alertes: Array<Alerte>;
};

const AlertesList: FC<Props> = ({ alertes }) => {
  let content = (
    <ul className="flex flex-col gap-y-4">
      {alertes.map((alerte) => (
        <li className="flex items-center gap-x-4" key={alerte.id}>
          <div className="text-warning">
            <WarningIcon size={12} />
          </div>
          <p>{new Date(alerte.date).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );

  return <div>{content}</div>;
};

export default AlertesList;
