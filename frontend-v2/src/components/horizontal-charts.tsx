import { FC, memo } from "react";

import StatItem from "./stat-item";
import Statistique from "../utils/types/statistique";
import useList from "../hooks/use-list";

type Props = {
  stats: Array<Statistique>;
  threshold: number;
};

const HorizontalCharts: FC<Props> = memo(({ stats, threshold }) => {
  const { list } = useList(stats, "date", 5);

  return (
    <>
      {list && list.length > 0 ? (
        <div className="w-full flex flex-col gap-y-8 items-center">
          <ul className="w-full flex flex-col items-center gap-y-4">
            {list.map((item: Statistique) => (
              <li className="w-full" key={item.id}>
                <StatItem capteurData={item} alerte={threshold} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
});

export default HorizontalCharts;
