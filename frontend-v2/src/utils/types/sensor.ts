import Statistique from "./statistique";

export default interface Sensor {
  id: number;
  name: string;
  humidityLevel?: number;
  timer: number;
  createdAt: string;
  threshold: number;
  sensorCreatedAt?: string;
  stats?: Statistique[];
}
