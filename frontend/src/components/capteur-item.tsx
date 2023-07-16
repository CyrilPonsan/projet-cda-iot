import React, { FC } from "react";

import Capteur from "../utils/types/capteur";

type Props = {
  capteur: Capteur;
};

const CapteurItem: FC<Props> = ({ capteur }) => {
  let style: any;
  const data = capteur.capteurData![0];

  if (capteur) {
    style = {
      "--value": data.txHumidite,
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
              <p>{new Date(data.date).toLocaleDateString()}</p>
              <p className="text-success text-xl">{data.txHumidite} %</p>
              <p>{new Date(data.date).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CapteurItem;
