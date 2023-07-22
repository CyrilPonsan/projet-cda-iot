import React, { FC } from "react";

type Props = {
  size: number;
  color: string;
};

const AddCapteur: FC<Props> = ({ size, color }) => {
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
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export default AddCapteur;
