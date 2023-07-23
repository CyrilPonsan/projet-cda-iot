import React, { useCallback, useEffect, useMemo, useState } from "react";

import { themes } from "../config/themes";

type ContextType = {
  theme: string;
  initTheme: () => void;
  toggleTheme: () => void;
};

export const Context = React.createContext<ContextType>({
  theme: themes.light,
  initTheme: () => {},
  toggleTheme: () => {},
});

export default function ContextProvider(props: any) {
  const [theme, setTheme] = useState<string>("");

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

  const contextValue: ContextType = useMemo(
    () => ({
      theme,
      initTheme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    // eslint-disable-next-line react/destructuring-assignment
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
}
