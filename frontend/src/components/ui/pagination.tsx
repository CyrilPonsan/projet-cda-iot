import { FC } from "react";
import NextIcon from "./svg/next-icon";
import PreviousIcon from "./svg/previous-icon";

type Props = {
  page: number;
  totalPages: number;
  setPage: (newPage: number) => void;
};

const Pagination: FC<Props> = ({ page, totalPages, setPage }) => {
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex gap-x-4 items-center font-bold">
      <button
        className="btn btn-circle btn-primary"
        onClick={() => setPage(page - 1)}
        disabled={!canPrevious}
      >
        <PreviousIcon />
      </button>
      <p>
        {page} / {totalPages}
      </p>
      <button
        className="btn btn-circle btn-primary"
        onClick={() => setPage(page + 1)}
        disabled={!canNext}
      >
        <NextIcon />
      </button>
    </div>
  );
};

export default Pagination;
