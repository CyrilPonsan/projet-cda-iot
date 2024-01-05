import CapteurData from "./capteur-data";
import lastReading from "./last-reading";

export default interface Capteur {
  id: string;
  alerte: number;
  timer: number;
  date: string;
  lastReading?: lastReading;
  capteurData?: Array<CapteurData>;
}
