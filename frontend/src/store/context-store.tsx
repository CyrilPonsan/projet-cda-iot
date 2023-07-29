import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { themes } from "../config/themes";
import BASE_URL from "../config/urls";
import useFilesystem from "../hooks/use-file-system";

type ContextType = {
  theme: string;
  counter: number;
  capteursIds: Array<string>;
  initTheme: () => void;
  toggleTheme: () => void;
  updateCounter: () => void;
  addCapteurs: (ids: Array<string>) => void;
  removeCapteur: (id: string) => void;
  addOneCapteur: (id: string) => void;
};

export const Context = React.createContext<ContextType>({
  theme: themes.light,
  counter: 0,
  capteursIds: [],
  initTheme: () => {},
  toggleTheme: () => {},
  updateCounter: () => {},
  addCapteurs: (ids: Array<string>) => {},
  removeCapteur: (id: string) => {},
  addOneCapteur: (id: string) => {},
});

export default function ContextProvider(props: any) {
  const [theme, setTheme] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [capteursIds, setCapteursIds] = useState<Array<string>>([]);
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
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark
      );
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

  const addCapteurs = useCallback((ids: Array<string>) => {
    setCapteursIds((prevList: Array<string>) => [...prevList, ...ids]);
  }, []);

  const addOneCapteur = useCallback((id: string) => {
    writeCapteur("capteurs.txt", id);
    setCapteursIds((prevList: Array<string>) => [...prevList, id]);
  }, []);

  const removeCapteur = useCallback((id: string) => {
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
    // eslint-disable-next-line react/destructuring-assignment
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
}
