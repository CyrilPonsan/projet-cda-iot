/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";

import Capteur from "../utils/types/capteur";

type Props = {
  capteur: Capteur;
};

const RadialItem: FC<Props> = ({ capteur }) => {
  let style: any;

  const data = capteur.lastReading?.txHumidite;

  if (capteur) {
    style = {
      "--value": capteur.lastReading?.txHumidite,
      "--size": "12rem",
      "--thickness": "8px",
    } as React.CSSProperties;
  }

  return (
    <>
      {capteur.capteurData ? (
        <div className="h-full flex flex-col gap-8 justify-between items-center">
          <div className="radial-progress text-info font-bold" style={style}>
            <div className="flex flex-col justify-center items-center text-accent text-sm">
              <p>{new Date(capteur.date).toLocaleDateString()}</p>
              <p className="text-success text-xl">{data} %</p>
              <p>{new Date(capteur.date).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default RadialItem;
