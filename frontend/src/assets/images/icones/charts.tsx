import React, { FC } from "react";

type Props = {
  size: number;
  color: string;
};

const Charts: FC<Props> = ({ size, color }) => {
  const style = `w-${size} h-${size} text-${color}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={style}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
      />
    </svg>
  );
};

export default Charts;
