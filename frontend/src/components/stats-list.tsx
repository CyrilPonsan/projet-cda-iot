import React, { FC } from "react";

import CapteurData from "../utils/types/capteur-data";
import useList from "../hooks/use-list";
import Pagination from "./ui/pagination";
import StatItem from "./stat-item";

type Props = {
  stats: Array<CapteurData>;
  alerte: number;
};

const StatsList: FC<Props> = ({ stats, alerte }) => {
  const { list, page, totalPages, setPage } = useList(stats, "date", 5);

  return (
    <>
      {list && list.length > 0 ? (
        <div className="w-full flex flex-col gap-y-8 items-center">
          <ul className="w-full flex flex-col items-center gap-y-4">
            {list.map((item: CapteurData) => (
              <li className="w-full" key={item.id}>
                <StatItem capteurData={item} alerte={alerte} />
              </li>
            ))}
          </ul>
          {totalPages > 1 ? (
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default StatsList;
