import React, { FC } from "react";

import Capteur from "../utils/types/capteur";

type Props = {
  capteur: Capteur;
};

const CapteurItem: FC<Props> = ({ capteur }) => {
  let style: any;

  if (capteur) {
    style = {
      "--value": capteur.txHumidite,
      "--size": "12rem",
      "--thickness": "8px",
    } as React.CSSProperties;
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <div className="radial-progress text-info font-bold" style={style}>
        <div className="flex flex-col justify-center items-center text-accent text-sm">
          <p>{new Date(capteur.date).toLocaleDateString()}</p>
          <p className="text-success text-xl">{capteur.txHumidite} %</p>
          <p>{new Date(capteur.date).toLocaleTimeString()}</p>
        </div>
      </div>
      <button className="w-fit btn btn-primary hover:none text-xs">
        {capteur.capteurId}
      </button>
    </div>
  );
};

export default CapteurItem;
