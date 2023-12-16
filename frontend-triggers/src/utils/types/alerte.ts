export default interface Alerte {
  id: string;
  txHumidite: number;
  hasBeenSeen: boolean;
  capteurId: string;
  date: string;
  isSelected: boolean;
}
