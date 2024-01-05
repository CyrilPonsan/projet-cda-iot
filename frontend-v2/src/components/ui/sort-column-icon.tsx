import { ChevronDown, ChevronUp } from "lucide-react";
import { FC } from "react";

type Props = {
  field: string;
  column: string;
  direction: boolean;
};

const SortColumnIcon: FC<Props> = ({ field, column, direction }) => {
  return (
    <>{field === column ? direction ? <ChevronUp /> : <ChevronDown /> : null}</>
  );
};

export default SortColumnIcon;
