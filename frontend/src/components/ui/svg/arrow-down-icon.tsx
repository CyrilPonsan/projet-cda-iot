import React, { FC } from "react";

type Props = {
  size?: string;
};

const ArrowDownIcon: FC<Props> = ({ size = "sm" }) => {
  const iconSize = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
  };

  return (
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
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
};

export default ArrowDownIcon;
