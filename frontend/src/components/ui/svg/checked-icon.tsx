import React, { FC } from "react";

type Props = {
  size?: string;
};

const CheckedIcon: FC<Props> = ({ size = "sm" }) => {
  const iconSize = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
  };

  return (
    <>
      {size ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${iconSize[size]}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : null}
    </>
  );
};

export default CheckedIcon;
