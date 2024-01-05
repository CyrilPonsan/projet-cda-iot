import { useCallback, useContext, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import Loader from "../../components/ui/loader";
import Sensor from "../../utils/types/sensor";
import { Context } from "../../store/context-store";
import useFilesystem from "../../hooks/use-file-system";
import toast from "react-hot-toast";
import ViewHeader from "../../components/ui/view-header";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Sensor>>([]);
  const { isLoading, sendRequest, error } = useHttp();
  const { updateCounter } = useContext(Context);
  const { readData, writeData } = useFilesystem();
  const { networkIssue, handleNetworkIssue } = useContext(Context);

  const fetchFSData = useCallback(async () => {
    const data = await readData("sensor-data.txt");
    if (data.length > 0) {
      const result = JSON.parse(data);
      setCapteursList(result);
    }
  }, [readData]);

  /**
   * récupération des données des capteurs depuis la bdd
   */
  const fetchSensors = useCallback(() => {
    const applyData = async (data: Sensor[]) => {
      setCapteursList(data);
      await writeData("sensor-data.txt", data);
      handleNetworkIssue(false);
    };
    sendRequest(
      {
        path: "",
      },
      applyData
    );
    updateCounter();
  }, [sendRequest, handleNetworkIssue, updateCounter, writeData]);

  // retourne la liste des sensors depuis la bdd
  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  // gère les erreurs http
  useEffect(() => {
    if (error.length > 0) {
      toast.error("Problème réseau, chargement des dernières données connues.");
      handleNetworkIssue(true);
      fetchFSData();
    }
  }, [error, handleNetworkIssue, fetchFSData]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 text-lg flex flex-col justify-center items-center w-full h-full">
      <ViewHeader networkIssue={networkIssue} onRefresh={fetchSensors} />
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-full w-full flex justify-center">
          {!capteursList || capteursList.length === 0 ? (
            <FadeWrapper>
              <NoCapteurs />
            </FadeWrapper>
          ) : capteursList.length > 0 ? (
            <FadeWrapper>
              <div className="w-full h-full flex flex-col flex-1">
                <CapteursList capteursList={capteursList} />
              </div>
            </FadeWrapper>
          ) : null}
        </div>
      )}
    </div>
  );
}
