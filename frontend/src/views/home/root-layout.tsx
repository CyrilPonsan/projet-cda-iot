import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context-store";

const RootLayout = () => {
  const { initTheme } = useContext(Context);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <Outlet />;
};

export default RootLayout;
