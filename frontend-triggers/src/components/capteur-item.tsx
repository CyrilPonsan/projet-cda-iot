/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";

import Capteur from "../utils/types/sensor";

type Props = {
  capteur: Capteur;
};

const CapteurItem: FC<Props> = ({ capteur }) => {
  let style: any;

  if (capteur.lastReading !== undefined) {
    style = {
      "--value": capteur.lastReading.txHumidite,
      "--size": "12rem",
      "--thickness": "8px",
    } as React.CSSProperties;
  }

  return (
    <>
      {capteur.lastReading ? (
        <div className="h-full flex flex-col gap-8 justify-center items-center">
          <div className="radial-progress text-info font-bold" style={style}>
            <div className="flex flex-col justify-center items-center text-info text-sm">
              <p>{new Date(capteur.lastReading.date).toLocaleDateString()}</p>
              <p className="text-success text-xl">
                {capteur.lastReading.txHumidite} %
              </p>
              <p>{new Date(capteur.lastReading.date).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CapteurItem;
