import React, { FC } from "react";

import Capteur from "../utils/types/capteur";
import CapteurItem from "./capteur-item";
import NoCapteurs from "./no-capteurs";
import ButtonLink from "./ui/button-link";
//import Portal from "./ui/portal";

type Props = {
  capteursList: Array<Capteur>;
};

const CapteursList: FC<Props> = ({ capteursList }: Props) => {
  const list: JSX.Element = (
    <div className="h-full w-full flex justify-center items-center">
      <ul className="flex flex-col md:flex-row gap-32 mb-8">
        {capteursList.map((item: Capteur) => (
          <li key={item.id}>
            <div className="h-full flex flex-col items-center gap-y-8">
              <CapteurItem capteur={item} />
              <ButtonLink
                label={item.id}
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
