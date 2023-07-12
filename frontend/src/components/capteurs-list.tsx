import React, { FC } from "react";
import Capteur from "../utils/types/capteur";
import CapteurItem from "./capteur-item";

type Props = {
  capteursList: Array<Capteur>;
};

const CapteursList: FC<Props> = ({ capteursList }) => {
  const list = (
    <ul className="flex flex-wrap items-center justify-center gap-x-32 gap-y-16">
      {capteursList.map((item: Capteur) => (
        <li key={item.id}>
          <CapteurItem capteur={item} />
        </li>
      ))}
    </ul>
  );

  return <div>{list}</div>;
};

export default CapteursList;
