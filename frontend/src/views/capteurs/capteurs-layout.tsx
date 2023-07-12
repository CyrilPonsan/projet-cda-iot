import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context-store";
import Sidebar from "../../components/ui/sidebar";

export default function CapteursLayout() {
  const { initTheme } = useContext(Context);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
