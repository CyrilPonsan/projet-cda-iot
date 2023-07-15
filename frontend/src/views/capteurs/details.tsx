import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import CapteurItem from "../../components/capteur-item";
import Capteur from "../../utils/types/capteur";
import CapteurDetails from "../../components/capteur-details";
import StatsList from "../../components/stats-list";

const Details = () => {
  const { id } = useParams();
  const { sendRequest } = useHttp();
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

  console.log({ capteur });

  return (
    <>
      {capteur ? (
        <div className="w-full h-full grid grid-rows-2 justify-center items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-32 justify-center items-center">
            <CapteurItem capteur={capteur} />
            <CapteurDetails capteur={capteur} />
          </div>
          {capteur.capteurData ? (
            <div>
              <StatsList stats={capteur.capteurData} alerte={capteur.alerte} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default Details;
