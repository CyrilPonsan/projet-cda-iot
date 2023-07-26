import React, { useCallback, useContext, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import Loader from "../../components/ui/loader";
import AlertesList from "../../components/alertes-list";
import { Context } from "../../store/context-store";
import Alerte from "../../utils/types/alerte";

const Alertes = () => {
  const [alertes, setAlertes] = useState<Array<any> | null>(null);
  const { sendRequest, isLoading } = useHttp();
  const { updateCounter } = useContext(Context);

  const updateItems = (alertesToUpdate: Array<Alerte>) => {
    const applyData = (data: any) => {
      fetchAlertes();
      updateCounter();
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

  const deleteItems = (alertesToDelete: Array<string>) => {
    const applyData = (data: any) => {
      fetchAlertes();
      updateCounter();
    };

    sendRequest(
      {
        path: `/humidite/delete`,
        method: "post",
        body: alertesToDelete,
      },
      applyData
    );
  };

  const fetchAlertes = useCallback(() => {
    const applyData = (data: any) => {
      const updatedData = data.map((item: any) => ({
        ...item,
        isSelected: false,
      }));
      setAlertes(updatedData);
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

  console.log({ alertes });

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
            <AlertesList
              alertes={alertes}
              onDeleteItems={deleteItems}
              onUpdateItems={updateItems}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Alertes;
