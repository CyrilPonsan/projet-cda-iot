import Lien from "./types/lien";
import AddCapteurIcon from "../components/ui/svg/add-capteur-icon";
import CapteurIcon from "../components/ui/svg/capteur-icon";
import AlertesIcon from "../components/ui/svg/alertes-icon";

export function getLiens() {
  const liens: Array<Lien> = [
    {
      icon: <CapteurIcon />,
      label: "Capteurs",
      path: "/capteurs",
    },
    {
      icon: <AlertesIcon />,
      label: "Alertes",
      path: "/alertes",
    },
    {
      icon: <AddCapteurIcon />,
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
