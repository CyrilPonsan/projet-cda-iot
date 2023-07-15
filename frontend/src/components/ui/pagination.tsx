import React, { FC } from "react";

type Props = {
  page: number;
  totalPages: number;
  setPage: (newPage: number) => void;
};

const Pagination: FC<Props> = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex gap-x-4 items-center font-bold">
      <button
        className="btn btn-circle btn-secondary text-base-content"
        onClick={() => setPage(page - 1)}
      >
        {"<"}
      </button>
      <p>{page}</p>
      <button
        className="btn btn-circle btn-secondary text-base-content"
        onClick={() => setPage(page + 1)}
      >
        {">"}
      </button>
    </div>
  );
};

export default Pagination;
