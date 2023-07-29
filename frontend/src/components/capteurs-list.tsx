import React, { FC } from "react";

import Capteur from "../utils/types/capteur";
import CapteurItem from "./capteur-item";
import NoCapteurs from "./no-capteurs";
import ButtonLink from "./ui/button-link";
//import Portal from "./ui/portal";

type Props = {
  capteursIds: Array<string>;
  capteursList: Array<Capteur>;
};

const CapteursList: FC<Props> = ({ capteursIds, capteursList }: Props) => {
  const getCapteur = (id: string): JSX.Element => {
    const capteur = capteursList.find((item) => item.id === id);
    return capteur ? (
      <div className="h-full flex flex-col items-center gap-y-8">
        <CapteurItem capteur={capteur} />
        <ButtonLink
          label={capteur.id}
          path={`/capteurs/details/${capteur.id}`}
        />
      </div>
    ) : (
      <NoCapteurs capteurId={id} />
    );
  };

  const list: JSX.Element = (
    <div className="h-full w-full flex justify-center items-center">
      <ul className="flex flex-col md:flex-row gap-32 mb-8">
        {capteursIds.map((item: string) => (
          <li key={item}>{getCapteur(item)}</li>
        ))}
      </ul>
    </div>
  );

  return <div className="h-full">{list}</div>;
};

export default CapteursList;
