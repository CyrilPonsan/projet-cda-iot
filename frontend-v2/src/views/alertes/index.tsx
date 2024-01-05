/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useContext, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import Loader from "../../components/ui/loader";
import AlertesList from "../../components/alertes-list";
import { Context } from "../../store/context-store";
import Alerte from "../../utils/types/alerte";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import toast from "react-hot-toast";
import useLazyLoading from "../../hooks/use-lazy-loading";
import ViewHeader from "../../components/ui/view-header";
import useFilesystem from "../../hooks/use-file-system";

const limit = 5;

const Alertes = () => {
  const { sendRequest, error } = useHttp();
  const { updateCounter } = useContext(Context);
  const {
    allChecked,
    list,
    direction,
    field,
    anySelected,
    page,
    totalPages,
    sortData,
    setAllChecked,
    handleRowCheck,
    setPage,
    setTotalPages,
    setList,
  } = useLazyLoading([], "createdAt", limit);
  const { networkIssue, handleNetworkIssue } = useContext(Context);
  const { readData, writeData } = useFilesystem();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * met à jour les alertes dans la bdd et actualise le compteur d'alertes dans la barre de navigation
   * @param alertesToUpdate Alerte[]
   */
  const updateItems = (alertesToUpdate: Array<number>) => {
    const applyData = (data: { message: string }) => {
      updateCounter();
      setAllChecked(false);
      fetchAlertes();
      toast.success(data.message);
    };
    if (alertesToUpdate.length > 0) {
      sendRequest(
        {
          path: "/alert",
          method: "put",
          body: { ids: alertesToUpdate },
        },
        applyData
      );
    }
  };

  const deleteItems = (alertesToDelete: Array<number>) => {
    const applyData = (_data: any) => {
      fetchAlertes();
      updateCounter();
      setAllChecked(false);
      setDeleting(false);
    };
    console.log({ alertesToDelete });
    setDeleting(true);
    sendRequest(
      {
        path: `/alert`,
        method: "delete",
        body: { ids: alertesToDelete },
      },
      applyData
    );
  };

  const fetchAlertesFromFs = useCallback(async () => {
    const data = await readData("alertes.txt");
    if (data.length > 0) {
      let result = JSON.parse(data);
      result = {
        ...result,
        alertes: result.alertes.map((item: any) => ({
          ...item,
          isSelected: false,
        })),
      };
      setList(result.alertes);
      setTotalPages(result.totalPages);
    }
  }, [readData, setList, setTotalPages]);

  const fetchAlertes = useCallback(() => {
    const applyData = async (data: {
      alertes: Alerte[];
      totalPages: number;
    }) => {
      const updatedData = data.alertes.map((item: any) => ({
        ...item,
        isSelected: false,
      }));
      setList(updatedData);
      updateCounter();
      setLoading(false);
      setTotalPages(data.totalPages);
      handleNetworkIssue(false);
      await writeData("alertes.txt", data);
    };
    setLoading(true);
    setAllChecked(false);
    sendRequest(
      {
        path: `/alert/?page=${page}&limit=${limit}&field=${field}&direction=${
          direction ? "true" : "false"
        }`,
      },
      applyData
    );
  }, [
    handleNetworkIssue,
    writeData,
    sendRequest,
    setList,
    setAllChecked,
    updateCounter,
    setTotalPages,
    page,
    field,
    direction,
  ]);

  useEffect(() => {
    fetchAlertes();
  }, [fetchAlertes]);

  // gestion des erreurs http
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoading(false);
      setDeleting(false);
      handleNetworkIssue(true);
      fetchAlertesFromFs();
    }
  }, [error, fetchAlertesFromFs, handleNetworkIssue]);

  return (
    <>
      {loading && list.length === 0 ? (
        <Loader />
      ) : !loading && list ? (
        <>
          <ViewHeader networkIssue={networkIssue} onRefresh={fetchAlertes} />
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-5/6 lg:w-5/6 xl:w-4/6 flex flex-col gap-y-8">
              {list.length > 0 ? (
                <>
                  <h1 className="font-bold text-xl text-primary underline">
                    Liste des alertes
                  </h1>
                  <FadeWrapper>
                    <AlertesList
                      isSubmitting={deleting}
                      list={list}
                      allChecked={allChecked}
                      direction={direction}
                      field={field}
                      anySelected={anySelected}
                      page={page}
                      totalPages={totalPages}
                      sortData={sortData}
                      setAllChecked={setAllChecked}
                      handleRowCheck={handleRowCheck}
                      setPage={setPage}
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
        </>
      ) : null}
    </>
  );
};

export default Alertes;
