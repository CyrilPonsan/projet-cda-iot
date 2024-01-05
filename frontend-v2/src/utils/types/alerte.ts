export default interface Alerte {
  id: string;
  humidityLevel: number;
  hasBeenSeen: boolean;
  name: string;
  createdAt: string;
  isSelected?: boolean;
}
