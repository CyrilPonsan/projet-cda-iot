/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { themes } from "../config/themes";
import BASE_URL from "../config/urls";
import useFilesystem from "../hooks/use-file-system";

type ContextType = {
  theme: string;
  counter: number;
  capteursIds: Array<number>;
  initTheme: () => void;
  toggleTheme: () => void;
  updateCounter: () => void;
  addCapteurs: (ids: Array<number>) => void;
  removeCapteur: (id: number) => void;
  addOneCapteur: (id: number) => void;
};

export const Context = React.createContext<ContextType>({
  theme: themes.light,
  counter: 0,
  capteursIds: [],
  initTheme: () => {},
  toggleTheme: () => {},
  updateCounter: () => {},
  addCapteurs: (_ids: Array<number>) => {},
  removeCapteur: (_id: number) => {},
  addOneCapteur: (_id: number) => {},
});

export default function ContextProvider(props: any) {
  const [theme, setTheme] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [capteursIds, setCapteursIds] = useState<Array<number>>([]);
  const { writeCapteur } = useFilesystem();

  const updateCounter = () => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/alertes/count`);
      if (response.ok) {
        const data = await response.json();
        setCounter(data.total);
      }
    };
    fetchData();
  };

  useEffect(() => {
    updateCounter();
  }, []);

  useEffect(() => {
    const element = document.querySelector("html");
    if (element) {
      element.setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark
      );
    }
  }, [theme]);

  const initTheme = () => {
    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");

    if (lightTheme) {
      themes.light = lightTheme;
    }

    if (darkTheme) {
      themes.dark = darkTheme;
    }

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme);
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  };

  const toggleTheme = useCallback(() => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("activeTheme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  }, [theme]);

  const addCapteurs = useCallback((ids: Array<number>) => {
    setCapteursIds(ids);
  }, []);

  const addOneCapteur = useCallback(
    (id: number) => {
      writeCapteur("capteurs.txt", id);
      setCapteursIds((prevList: Array<number>) => [...prevList, id]);
    },
    [writeCapteur]
  );

  const removeCapteur = useCallback((id: number) => {
    setCapteursIds((prevList) => prevList.filter((item: any) => item !== id));
  }, []);

  const contextValue: ContextType = useMemo(
    () => ({
      theme,
      counter,
      capteursIds,
      updateCounter,
      initTheme,
      toggleTheme,
      addCapteurs,
      removeCapteur,
      addOneCapteur,
    }),
    [
      theme,
      counter,
      capteursIds,
      toggleTheme,
      addCapteurs,
      removeCapteur,
      addOneCapteur,
    ]
  );

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
}
