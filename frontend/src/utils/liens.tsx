import React from "react";

import Warning from "../assets/images/icones/warning";
import Capteur from "../assets/images/icones/capteur";
import AddCapteur from "../assets/images/icones/add-capteur";
import Lien from "./types/lien";

export function getLiens(size: number, color: string) {
  let liens: Array<Lien> = [
    {
      icon: <Capteur size={size} color={color} />,
      label: "Capteurs",
      path: "/capteurs",
    },
    {
      icon: <Warning size={size} color={color} />,
      label: "Alertes",
      path: "/charts",
    },
    {
      icon: <AddCapteur size={size} color={color} />,
      label: "Ajouter un Capteur",
      path: "/capteurs/add",
    },
  ];
  let i = 0;
  return liens.map((item) => {
    item = { ...item, id: i };
    i++;
    return item;
  });
}
