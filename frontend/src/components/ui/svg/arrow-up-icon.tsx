import React, { FC } from "react";

type Props = {
  size?: string;
};

const ArrowUpIcon: FC<Props> = ({ size = "sm" }) => {
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
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
};

export default ArrowUpIcon;
