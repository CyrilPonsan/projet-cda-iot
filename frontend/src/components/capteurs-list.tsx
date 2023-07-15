import React, { FC } from "react";
import Capteur from "../utils/types/capteur";
import CapteurItem from "./capteur-item";
import NoCapteurs from "./no-capteurs";

type Props = {
  capteursIds: Array<string>;
  capteursList: Array<Capteur>;
};

const CapteursList: FC<Props> = ({ capteursIds, capteursList }) => {
  const getCapteur = (id: string) => {
    const capteur = capteursList.find((item) => item.capteurId === id);
    return capteur ? (
      <CapteurItem capteur={capteur} />
    ) : (
      <NoCapteurs capteurId={id} />
    );
  };

  const list = (
    <div className="h-full w-full flex justify-center items-center">
      <ul className="h-full w-full grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-32 gap-y-32 mb-8">
        {capteursIds.map((item: string) => (
          <li className="h-full" key={item}>
            {getCapteur(item)}
          </li>
        ))}
      </ul>
    </div>
  );

  return <div className="h-full">{list}</div>;
};

export default CapteursList;
