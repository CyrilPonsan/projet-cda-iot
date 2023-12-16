import { AlertTriangle, PlusCircle, Radio } from "lucide-react";

import Lien from "./types/lien";

export function getLiens() {
  const liens: Array<Lien> = [
    {
      icon: <Radio />,
      label: "Capteurs",
      path: "/capteurs",
    },
    {
      icon: <AlertTriangle />,
      label: "Alertes",
      path: "/alertes",
    },
    {
      icon: <PlusCircle />,
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
