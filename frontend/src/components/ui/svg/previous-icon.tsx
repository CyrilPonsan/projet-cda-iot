import React, { FC } from "react";

type Props = {
  size?: number;
};

const PreviousIcon: FC<Props> = ({ size = 6 }) => {
  let style = `w-${size} h-${size}`;

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
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  );
};

export default PreviousIcon;