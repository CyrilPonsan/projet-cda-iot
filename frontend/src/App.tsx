import React, { useEffect } from "react";
import { RouterProvider, createHashRouter } from "react-router-dom";
import RootLayout from "./views/home/root-layout";
import HomePage from "./views/home";
import { version } from "./config/version";
import "./App.css";
import CapteursLayout from "./views/capteurs/capteurs-layout";
import CapteursListPage from "./views/capteurs";
import ContextProvider from "./store/context-store";
import AddCapteur from "./views/capteurs/add-capteur";

const title = "Alerte Arrosoir v" + version;

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
          element: <CapteursLayout />,
          children: [
            {
              index: true,
              element: <CapteursListPage />,
            },
            {
              path: "add",
              element: <AddCapteur />,
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
