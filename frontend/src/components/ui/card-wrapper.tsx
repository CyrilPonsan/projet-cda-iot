import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const CardWrapper: FC<Props> = ({ children }) => {
  return <div className="p-8 rounded-lg  bg-secondary/50">{children}</div>;
};

export default CardWrapper;
