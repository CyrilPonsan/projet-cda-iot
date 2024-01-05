import { FC } from "react";

import ArrowUpIcon from "./svg/arrow-up-icon";
import ArrowDownIcon from "./svg/arrow-down-icon";

type Props = {
  fieldSort: string;
  column: string;
  direction: boolean;
};

const SortColumnIcon: FC<Props> = ({ fieldSort, column, direction }) => {
  return (
    <>
      {fieldSort === column ? (
        direction ? (
          <ArrowUpIcon />
        ) : (
          <ArrowDownIcon />
        )
      ) : null}
    </>
  );
};

export default SortColumnIcon;
