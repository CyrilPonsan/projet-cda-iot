/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import CapteurItem from "../../components/capteur-item";
import CapteurDetails from "../../components/capteur-details";
import Loader from "../../components/ui/loader";
import NoCapteurs from "../../components/no-capteurs";
import HorizontalCharts from "../../components/horizontal-charts";
import VerticalCharts from "../../components/vertical-charts";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import ChartSwap from "../../components/ui/chart-swap";
import CapteurEdition from "../../components/capteur-edition";
import Sensor from "../../utils/types/sensor";

const Details = () => {
  const { id } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [capteur, setCapteur] = useState<Sensor | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const applyData = (data: any) => {
      setCapteur(data);
    };
    if (id) {
      sendRequest(
        {
          path: `/sensor/${id}`,
        },
        applyData
      );
    }
  }, [id, sendRequest]);

  const toggleCharts = () => {
    setIsHorizontal((prevState) => !prevState);
  };

  const toggleEditMode = () => {
    setEditMode((prevState) => !prevState);
  };

  const updateCapteur = (updatedCapteur: Sensor) => {
    setCapteur(updatedCapteur);
    toggleEditMode();
  };

  console.log(capteur?.stats);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && capteur && !editMode ? (
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="w-fit h-full flex flex-col justify-center items-around gap-y-8">
            <div className="w-full flex flex-col md:flex-row gap-4 justify-start items-center">
              <CapteurDetails
                capteur={capteur}
                onToggleEditMode={toggleEditMode}
              />
              <CapteurItem capteur={capteur} />
            </div>
            <div className="w-full flex flex-col items-center gap-y-4">
              <div className="divider text-xs">
                Moyenne quotidienne des derniers relevés
              </div>
              <ChartSwap chartType={isHorizontal} onChartType={toggleCharts} />
              {capteur.stats && capteur.stats.length > 0 ? (
                <>
                  {isHorizontal ? (
                    <FadeWrapper>
                      <HorizontalCharts
                        stats={capteur.stats!}
                        threshold={capteur.threshold}
                      />
                    </FadeWrapper>
                  ) : (
                    <FadeWrapper>
                      <VerticalCharts
                        stats={capteur.stats!}
                        alerte={capteur.threshold}
                      />
                    </FadeWrapper>
                  )}
                </>
              ) : (
                <div className="w-full flex justify-start">
                  <p>Aucun relevé d'humidité enregistré pour l'instant</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {!isLoading && capteur && editMode ? (
            <CapteurEdition
              capteur={capteur}
              onToggleEdit={toggleEditMode}
              onUpdateCapteur={updateCapteur}
            />
          ) : null}
        </>
      )}
      {error.length > 0 && !editMode ? (
        <div className="w-full h-full flex justify-center items-center">
          <div>
            <NoCapteurs capteurId={id} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Details;
