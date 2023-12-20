export default interface Sensor {
  id?: number;
  name: string;
  humidityLever?: number;
  timer: number;
  createdAt: string;
  threshold: number;
}
