/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

import Alerte from "../utils/types/alerte";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

type Props = {
  alerte: any;
  onRowCheck: (id: number) => void;
  onDeleteItem: (id: number) => void;
};

const AlerteItem: FC<Props> = ({ alerte, onRowCheck, onDeleteItem }) => {
  const setStyle = (alerte: Alerte) => {
    return {
      "--value": alerte.humidityLevel,
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
            <CheckCircle />
          </div>
        ) : (
          <div className="text-warning">
            <AlertTriangle />
          </div>
        )}
      </td>
      <td className="bg-transparent">
        {new Date(alerte.createdAt).toLocaleDateString()}{" "}
        {new Date(alerte.createdAt).toLocaleTimeString()}
      </td>
      <td className="capitalize">{alerte.name}</td>
      <td className="flex justify-center items-center">
        <div
          className="radial-progress text-info font-bold"
          style={setStyle(alerte)}
        >
          <div className="flex flex-col justify-center items-center text-info text-sm">
            <p className="text-success text-xs">{alerte.humidityLevel} %</p>
          </div>
        </div>
      </td>
      <td className="text-error cursor-pointer">
        <div className="w-full flex justify-center items-center">
          <div
            className="tooltip tooltip-bottom"
            data-tip="Supprimer de la base de données"
          >
            <div onClick={() => onDeleteItem(alerte.id)}>
              <Trash2 />
            </div>
          </div>
        </div>
      </td>
    </>
  );
};

export default AlerteItem;
