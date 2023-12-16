import { sortArray } from "../utils/sortArray";
import CapteurData from "../utils/types/capteur-data";

export function getStats(capteurDatas: Array<CapteurData>, alerte: number) {
  const stats = sortArray(
    capteurDatas.map((item) => ({
      ...item,
      date: new Date(item.date).getTime(),
    })),
    "date"
  );

  let tmp = Array<CapteurData>();
  const seuils = Array<number>();
  for (let i = stats.length - 1; i > -1; i--) {
    tmp.push(stats[i]);
    seuils.push(alerte);
  }

  tmp = sortArray(tmp, "date").map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
  }));

  const labels = tmp.map((item: CapteurData) => item.date);
  const averages = tmp.map((item: CapteurData) => item.averageHumidity);

  return {
    labels,
    averages,
    seuils,
  };
}
