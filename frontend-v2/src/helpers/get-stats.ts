import { sortArray } from "../utils/sortArray";
import Statistique from "../utils/types/statistique";

export function getStats(capteurDatas: Array<Statistique>, alerte: number) {
  const stats = sortArray(
    capteurDatas.map((item) => ({
      ...item,
      date: new Date(item.date).getTime(),
    })),
    "date"
  );

  let tmp = Array<Statistique>();
  const seuils = Array<number>();
  for (let i = stats.length - 1; i > -1; i--) {
    tmp.push(stats[i]);
    seuils.push(alerte);
  }

  tmp = sortArray(tmp, "date").map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
  }));

  const labels = tmp.map((item: Statistique) => item.date);
  const averages = tmp.map((item: Statistique) => item.average);

  return {
    labels,
    averages,
    seuils,
  };
}
