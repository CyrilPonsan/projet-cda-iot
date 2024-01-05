import { useCallback, useContext, useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import Loader from "../../components/ui/loader";
import Sensor from "../../utils/types/sensor";
import { RefreshCw } from "lucide-react";
import { Context } from "../../store/context-store";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Sensor>>([]);
  const { isLoading, sendRequest } = useHttp();
  const { updateCounter } = useContext(Context);

  /**
   * récupération des données des capteurs depuis la bdd
   */
  const fetchSensors = useCallback(() => {
    const applyData = (data: Sensor[]) => {
      setCapteursList(data);
    };
    sendRequest(
      {
        path: "",
      },
      applyData
    );
    updateCounter();
  }, [sendRequest, updateCounter]);

  // retourne la liste des sensors depuis la bdd
  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 text-lg flex flex-col justify-center items-center w-full h-full">
      <div className="w-full flex justify-end cursor-pointer">
        <span
          className="tooltip tooltip-left"
          data-tip="Rafraîchir les données"
          aria-label="recharger la liste des données"
        >
          <RefreshCw className="text-primary" onClick={fetchSensors} />
        </span>
      </div>
      <div className="divider" />
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
