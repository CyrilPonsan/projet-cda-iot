import React, { FC } from "react";
import CapteurData from "../utils/types/capteur-data";

type Props = {
  capteurData: CapteurData;
  alerte: number;
};

const StatItem: FC<Props> = ({ capteurData, alerte }) => {
  const date = new Date(capteurData.date).toLocaleDateString();
  const time = new Date(capteurData.date).toLocaleTimeString();

  const setColor = () => {
    return capteurData.txHumidite >= alerte ? "info" : "warning";
  };

  return (
    <div className="w-full flex gap-x-4 items-center">
      <div className="w-full flex flex-col gap-y-2 items-start">
        <span className="flex gap-x-4">
          <p className={`text-${setColor()} font-bold`}>
            {capteurData.txHumidite} %
          </p>
          <p>
            {date} à {time}
          </p>
        </span>
        {capteurData.txHumidite >= alerte ? (
          <progress
            className="progress progress-info"
            value={capteurData.txHumidite}
            max="100"
          ></progress>
        ) : (
          <progress
            className="progress progress-warning"
            value={capteurData.txHumidite}
            max="100"
          ></progress>
        )}
      </div>
    </div>
  );
};

export default StatItem;
