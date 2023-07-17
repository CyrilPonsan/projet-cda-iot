import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import CapteurItem from "../../components/capteur-item";
import Capteur from "../../utils/types/capteur";
import CapteurDetails from "../../components/capteur-details";
import StatsList from "../../components/stats-list";
import Loader from "../../components/ui/loader";
import NoCapteurs from "../../components/no-capteurs";

const Details = () => {
  const { id } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [capteur, setCapteur] = useState<Capteur | null>(null);

  useEffect(() => {
    const applyData = (data: any) => {
      setCapteur(data);
    };
    if (id) {
      sendRequest(
        {
          path: `/stats?capteurId=${id}`,
        },
        applyData
      );
    }
  }, [id, sendRequest]);

  console.log({ capteur, error });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && capteur ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-fit h-full flex flex-col justify-center items-around gap-y-8">
            <div className="w-full flex flex-col md:flex-row gap-32 justify-center items-center">
              <CapteurDetails capteur={capteur} />
              {capteur.capteurData && capteur.capteurData.length > 0 ? (
                <CapteurItem capteur={capteur} />
              ) : (
                <NoCapteurs capteurId={id} />
              )}
            </div>
            <div className="w-full flex flex-col items-center">
              <div className="divider text-xs">Derniers relevés</div>
              {capteur.capteurData && capteur.capteurData.length > 0 ? (
                <StatsList
                  stats={capteur.capteurData}
                  alerte={capteur.alerte}
                />
              ) : (
                <div className="w-full flex justify-start">
                  <p>Aucun relevé d'humdité enregistré pour l'instant</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Details;
