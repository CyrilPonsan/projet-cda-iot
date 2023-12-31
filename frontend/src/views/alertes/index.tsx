/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import Loader from "../../components/ui/loader";
import AlertesList from "../../components/alertes-list";
import { Context } from "../../store/context-store";
import Alerte from "../../utils/types/alerte";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";

const Alertes = () => {
  const [alertes, setAlertes] = useState<Array<any> | null>(null);
  const { sendRequest, isLoading } = useHttp();
  const { updateCounter } = useContext(Context);

  const updateItems = (alertesToUpdate: Array<Alerte>) => {
    const applyData = (_data: any) => {
      fetchAlertes();
      updateCounter();
    };
    if (alertesToUpdate.length > 0) {
      sendRequest(
        {
          path: "/alertes/update",
          method: "put",
          body: alertesToUpdate,
        },
        applyData
      );
    }
  };

  const deleteItems = (alertesToDelete: Array<string>) => {
    const applyData = (_data: any) => {
      fetchAlertes();
      updateCounter();
    };

    sendRequest(
      {
        path: `/alertes/delete`,
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
      updateCounter();
    };
    sendRequest(
      {
        path: "/alertes/get",
      },
      applyData
    );
  }, [sendRequest, updateCounter]);

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
            {alertes.length > 0 ? (
              <>
                <h1 className="font-bold text-xl text-primary underline">
                  Liste des alertes
                </h1>
                <FadeWrapper>
                  <AlertesList
                    alertes={alertes}
                    onDeleteItems={deleteItems}
                    onUpdateItems={updateItems}
                  />
                </FadeWrapper>
              </>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <h2 className="text-xl text-primary font-normal">
                  Aucune alerte à afficher
                </h2>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Alertes;
