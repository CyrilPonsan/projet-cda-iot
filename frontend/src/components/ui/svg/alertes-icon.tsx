import React, { FC } from "react";

type Props = {
  size?: string;
  color?: string;
};

const AlertesIcon: FC<Props> = ({ size = "sm", color = "base" }) => {
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
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
};

export default AlertesIcon;
