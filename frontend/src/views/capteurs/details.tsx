import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import CapteurItem from "../../components/capteur-item";
import Capteur from "../../utils/types/capteur";
import CapteurDetails from "../../components/capteur-details";
import StatsList from "../../components/stats-list";
import Loader from "../../components/ui/loader";

const Details = () => {
  const { id } = useParams();
  const { isLoading, sendRequest } = useHttp();
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && capteur ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-fit h-full flex flex-col justify-center items-around gap-y-8">
            <div className="w-full flex flex-col md:flex-row gap-32 justify-center items-center">
              <CapteurDetails capteur={capteur} />
              <CapteurItem capteur={capteur} />
            </div>
            {capteur.capteurData ? (
              <div className="w-full flex flex-col items-center">
                <div className="divider text-xs">Derniers relevés</div>
                <StatsList
                  stats={capteur.capteurData}
                  alerte={capteur.alerte}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Details;
