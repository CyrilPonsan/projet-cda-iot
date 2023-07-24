import React, { FC } from "react";

type Props = {
  size?: string;
  color?: string;
};

const AddCapteurIcon: FC<Props> = ({ size = "sm", color = "base" }) => {
  const iconSize = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
  };

  const iconColor = {
    accent: "text-accent",
    base: "",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${iconSize[size]} ${iconColor[color]}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export default AddCapteurIcon;
