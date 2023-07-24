import React, { FC } from "react";

import Alerte from "../utils/types/alerte";
import WarningIcon from "./ui/svg/warning-icon";
import TrashIcon from "./ui/svg/trash-icons";
import CheckedIcon from "./ui/svg/checked-icon";

type Props = {
  alerte: any;
  onRowCheck: (id: string) => void;
};

const AlerteItem: FC<Props> = ({ alerte, onRowCheck }) => {
  const setStyle = (alerte: Alerte) => {
    return {
      "--value": alerte.txHumidite,
      "--size": "3rem",
      "--thickness": "4px",
    } as React.CSSProperties;
  };

  return (
    <>
      <td className="bg-transparent">
        <input
          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary flex justify-center items-center"
          type="checkbox"
          checked={alerte.isSelected}
          onChange={() => onRowCheck(alerte.id)}
        />
      </td>
      <td className="bg-transparent">
        {alerte.hasBeenSeen ? (
          <div className="text-success">
            <CheckedIcon size="md" />
          </div>
        ) : (
          <div className="text-warning">
            <WarningIcon size="md" />
          </div>
        )}
      </td>
      <td className="bg-transparent">
        {new Date(alerte.date).toLocaleDateString()}
      </td>
      <td>{alerte.capteurId}</td>
      <td className="flex justify-center items-center">
        <div
          className="radial-progress text-info font-bold"
          style={setStyle(alerte)}
        >
          <div className="flex flex-col justify-center items-center text-info text-sm">
            <p className="text-success text-xs">{alerte.txHumidite} %</p>
          </div>
        </div>
      </td>
      <td className="text-error cursor-pointer">
        <div className="w-full flex justify-center items-center">
          <div
            className="tooltip tooltip-bottom"
            data-tip="Supprimer de la base de données"
          >
            <TrashIcon />
          </div>
        </div>
      </td>
    </>
  );
};

export default AlerteItem;
