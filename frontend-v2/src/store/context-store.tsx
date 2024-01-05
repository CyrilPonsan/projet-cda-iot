/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { themes } from "../config/themes";
import { BASE_URL } from "../config/urls";

type ContextType = {
  theme: string;
  counter: number;
  networkIssue: boolean;
  handleNetworkIssue: (value: boolean) => void;
  initTheme: () => void;
  toggleTheme: () => void;
  updateCounter: () => void;
};

export const Context = React.createContext<ContextType>({
  theme: themes.light,
  counter: 0,
  networkIssue: false,
  handleNetworkIssue: () => {},
  initTheme: () => {},
  toggleTheme: () => {},
  updateCounter: () => {},
});

export default function ContextProvider(props: any) {
  const [theme, setTheme] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [networkIssue, setNetworkIssue] = useState(false);

  const updateCounter = useCallback(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/alert/count`);
      if (response.ok) {
        const data = await response.json();
        setCounter(data.total);
      }
    };
    fetchData();
  }, []);

  const handleNetworkIssue = useCallback((value: boolean) => {
    setNetworkIssue(value);
  }, []);

  useEffect(() => {
    updateCounter();
  }, [updateCounter]);

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

  const contextValue: ContextType = useMemo(
    () => ({
      theme,
      counter,
      networkIssue,
      handleNetworkIssue,
      updateCounter,
      initTheme,
      toggleTheme,
    }),
    [
      theme,
      counter,
      networkIssue,
      handleNetworkIssue,
      updateCounter,
      toggleTheme,
    ]
  );

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
}
