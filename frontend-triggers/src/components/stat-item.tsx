import { FC } from "react";

import CapteurData from "../utils/types/capteur-data";

type Props = {
  capteurData: CapteurData;
  alerte: number;
};

const StatItem: FC<Props> = ({ capteurData, alerte }) => {
  const date = new Date(capteurData.date).toLocaleDateString();

  const average = capteurData.averageHumidity;

  const setColor = () => {
    return average >= alerte ? "info" : "warning";
  };

  return (
    <div className="w-full flex gap-x-4 items-center">
      <div className="w-full flex flex-col gap-y-2 items-start">
        <span className="flex gap-x-4">
          <p className={`text-${setColor()} font-bold`}>{average} %</p>
          <p>{date}</p>
        </span>
        {average >= alerte ? (
          <progress
            className="progress progress-info"
            value={average}
            max="100"
          ></progress>
        ) : (
          <progress
            className="progress progress-warning"
            value={average}
            max="100"
          ></progress>
        )}
      </div>
    </div>
  );
};

export default StatItem;
