import React, { useEffect, useState } from "react";
import BASE_URL from "../config/urls";

type AlertesContextType = {
  counter: number;
  updateCounter: () => void;
};

export const AlertesContext = React.createContext<AlertesContextType>({
  counter: 0,
  updateCounter: () => {},
});

export default function AlertesProvider(props: any) {
  const [counter, setCounter] = useState<number>(0);

  const updateCounter = () => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/alertes/count`);
      if (response.ok) {
        const data = await response.json();
        console.log({ data });

        setCounter(data.total);
      }
    };
    fetchData();
  };

  useEffect(() => {
    updateCounter();
  }, []);

  const contextValue: AlertesContextType = {
    counter,
    updateCounter,
  };

  return (
    <AlertesContext.Provider value={contextValue}>
      {props.children}
    </AlertesContext.Provider>
  );
}
