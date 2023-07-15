import CapteurData from "./capteur-data";

export default interface Capteur {
  id: string;
  alerte: number;
  timer: number;
  date: string;
  capteurData?: Array<CapteurData>;
}
