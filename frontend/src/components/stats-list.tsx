import React, { FC } from "react";

import CapteurData from "../utils/types/capteur-data";
import useList from "../hooks/use-list";
import Pagination from "./ui/pagination";

type Props = {
  stats: Array<CapteurData>;
  alerte: number;
};

const StatsList: FC<Props> = ({ stats, alerte }) => {
  const { list, page, totalPages, setPage } = useList(stats, "date", 7);

  return (
    <>
      {list && list.length > 0 ? (
        <>
          <ul>
            {list.map((item: CapteurData) => (
              <li key={item.id}>{item.date}</li>
            ))}
          </ul>
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      ) : null}
    </>
  );
};

export default StatsList;
