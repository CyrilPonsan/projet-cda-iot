/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";

import Sensor from "../utils/types/sensor";
import { localeDate, localeTime } from "../helpers/locale-datetime";

type Props = {
  capteur: Sensor;
};

const CapteurItem: FC<Props> = ({ capteur }) => {
  const style = {
    "--value": capteur.humidityLevel,
    "--size": "12rem",
    "--thickness": "8px",
  } as React.CSSProperties;

  return (
    <>
      <div className="h-full flex flex-col gap-8 justify-start items-end">
        <div className="radial-progress text-info font-bold" style={style}>
          <div className="flex flex-col justify-center items-center text-info text-sm">
            <p>{localeDate(capteur.createdAt)}</p>
            <p className="text-success text-xl">{capteur.humidityLevel} %</p>
            <p>{localeTime(capteur.createdAt)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CapteurItem;
