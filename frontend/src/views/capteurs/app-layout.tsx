import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../../store/context-store";
import Sidebar from "../../components/ui/sidebar";

declare global {
  interface Window {
    my_modal_1: {
      showModal: () => void;
      // D'autres propriétés et méthodes nécessaires pour le modal
    };
  }
}

export default function AppLayout() {
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
