import { FC } from "react";

import CapteurItem from "./capteur-item";
import ButtonLink from "./ui/button-link";
import Sensor from "../utils/types/sensor";

type Props = {
  capteursList: Array<Sensor>;
};

const CapteursList: FC<Props> = ({ capteursList }: Props) => {
  const list = (
    <div className="h-full w-full flex justify-center items-center">
      <ul className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-32 mb-8">
        {capteursList.map((item: Sensor) => (
          <li key={item.id}>
            <div className="h-full flex flex-col items-center gap-y-8">
              <CapteurItem capteur={item} />
              <ButtonLink
                label={item.name}
                path={`/capteurs/details/${item.id}`}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return <div className="h-full">{list}</div>;
};

export default CapteursList;
