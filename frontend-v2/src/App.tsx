import { useEffect } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";

import RootLayout from "./views/home/root-layout";
import HomePage from "./views/home";
import { version } from "./config/version";
import CapteursListPage from "./views/capteurs";
import ContextProvider from "./store/context-store";
import AddCapteur from "./views/capteurs/add-capteur";
import Details from "./views/capteurs/details";
import AppLayout from "./views/capteurs/app-layout";
import Alertes from "./views/alertes";

const title = "Alerte Arrosoir v" + version;

declare global {
  interface Window {
    my_modal_1: {
      showModal: () => void;
    };
  }
}

export default function App() {
  const router = createHashRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "capteurs",
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <CapteursListPage />,
            },
            {
              path: "add",
              element: <AddCapteur />,
            },
            {
              path: "details/:id",
              element: <Details />,
            },
          ],
        },
        {
          path: "alertes",
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <Alertes />,
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    document.title = title;
  }, []);

  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}
