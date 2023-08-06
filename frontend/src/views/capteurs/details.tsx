/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import CapteurItem from "../../components/capteur-item";
import Capteur from "../../utils/types/capteur";
import CapteurDetails from "../../components/capteur-details";
import Loader from "../../components/ui/loader";
import NoCapteurs from "../../components/no-capteurs";
import HorizontalCharts from "../../components/horizontal-charts";
import VerticalCharts from "../../components/vertical-charts";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import ChartSwap from "../../components/ui/chart-swap";

const Details = () => {
  const { id } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [capteur, setCapteur] = useState<Capteur | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);

  useEffect(() => {
    const applyData = (data: any) => {
      setCapteur(data);
    };
    if (id) {
      sendRequest(
        {
          path: `/humidite/stats?capteurId=${id}`,
        },
        applyData
      );
    }
  }, [id, sendRequest]);

  const toggleCharts = () => {
    setIsHorizontal((prevState) => !prevState);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && capteur ? (
        <div className="w-full h-full flex flex-col justify-start items-center">
          <div className="w-fit h-full flex flex-col justify-center items-around gap-y-8">
            <div className="w-full flex flex-col md:flex-row gap-4 justify-start items-center">
              <CapteurDetails capteur={capteur} />
              {capteur.capteurData && capteur.capteurData.length > 0 ? (
                <CapteurItem capteur={capteur} />
              ) : null}
            </div>
            <div className="w-full flex flex-col items-center gap-y-4">
              <div className="divider text-xs">
                Moyenne quotidienne des derniers relevés
              </div>
              <ChartSwap chartType={isHorizontal} onChartType={toggleCharts} />
              {capteur.capteurData && capteur.capteurData.length > 0 ? (
                <>
                  {isHorizontal ? (
                    <FadeWrapper>
                      <HorizontalCharts
                        stats={capteur.capteurData!}
                        alerte={capteur.alerte}
                      />
                    </FadeWrapper>
                  ) : (
                    <FadeWrapper>
                      <VerticalCharts
                        stats={capteur.capteurData!}
                        alerte={capteur.alerte}
                      />
                    </FadeWrapper>
                  )}
                </>
              ) : (
                <div className="w-full flex justify-start">
                  <p>Aucun relevé d'humdité enregistré pour l'instant</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {error.length > 0 ? (
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
/* 
<StatsList
stats={capteur.capteurData}
alerte={capteur.alerte}
/> */
