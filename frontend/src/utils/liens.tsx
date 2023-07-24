import React from "react";

import Lien from "./types/lien";
import AddCapteurIcon from "../components/ui/svg/add-capteur-icon";
import CapteurIcon from "../components/ui/svg/capteur-icon";
import AlertesIcon from "../components/ui/svg/alertes-icon";

export function getLiens(size: string) {
  let liens: Array<Lien> = [
    {
      icon: <CapteurIcon size={size} />,
      label: "Capteurs",
      path: "/capteurs",
    },
    {
      icon: <AlertesIcon size={size} />,
      label: "Alertes",
      path: "/alertes",
    },
    {
      icon: <AddCapteurIcon size={size} />,
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
