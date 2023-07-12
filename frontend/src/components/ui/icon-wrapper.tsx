import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  padding: number;
};

const IconWrapper: FC<Props> = ({ children, padding }) => {
  const style = `rounded-full p-${padding} bg-secondary/50`;

  return <div className={style}>{children}</div>;
};

export default IconWrapper;
