import React, { useCallback, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import Loader from "../../components/ui/loader";
import AlertesList from "../../components/alertes-list";
import AlertesProvider from "../../store/alertes-store";

const Alertes = () => {
  const [alertes, setAlertes] = useState<Array<any> | null>(null);
  const { sendRequest, isLoading } = useHttp();

  const updateItems = (alertesToUpdate: any) => {
    const applyData = (data: any) => {
      fetchAlertes();
    };
    sendRequest(
      {
        path: "/alertes/update",
        method: "put",
        body: alertesToUpdate,
      },
      applyData
    );
  };

  const fetchAlertes = useCallback(() => {
    const applyData = (data: any) => {
      setAlertes(data);
    };
    sendRequest(
      {
        path: "/alertes/get",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    fetchAlertes();
  }, [fetchAlertes]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && alertes ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-full h-5/6 md:w-5/6 xl:w-4/6 flex flex-col gap-y-8">
            <h1 className="font-bold text-xl text-primary">
              Liste des alertes
            </h1>
            <AlertesProvider>
              <AlertesList alertes={alertes} onUpdateItems={updateItems} />
            </AlertesProvider>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Alertes;
