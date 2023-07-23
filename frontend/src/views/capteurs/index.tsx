import React, { useCallback, useEffect, useState } from "react";

import Capteur from "../../utils/types/capteur";
import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import useFilesystem from "../../hooks/use-file-system";
import Loader from "../../components/ui/loader";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Capteur>>([]);
  const [capteursIds, setCapteursIds] = useState<Array<string> | null>(null);
  const { isLoading, sendRequest } = useHttp();
  const { readData } = useFilesystem();

  const fetchHumidityRate = useCallback(
    (capteursIds: Array<string>) => {
      const applyData = (data: Capteur) => {
        setCapteursList((prevList: Array<Capteur>) => [...prevList, data]);
      };
      capteursIds.forEach((item) =>
        sendRequest(
          {
            path: `/humidite/one-capteur?capteurId=${item}`,
          },
          applyData
        )
      );
    },
    [sendRequest]
  );

  const getData = useCallback(async () => {
    const result = await readData("capteurs.txt");
    setCapteursIds(JSON.parse(result));
    fetchHumidityRate(JSON.parse(result));
  }, [readData, fetchHumidityRate]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 text-lg flex justify-center items-center w-full h-full">
      {isLoading ? (
        <Loader />
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <div className="h-full w-full flex justify-center items-center">
          {!capteursList || capteursList.length === 0 ? (
            <FadeWrapper>
              <NoCapteurs />
            </FadeWrapper>
          ) : capteursList.length !== 0 && capteursIds ? (
            <FadeWrapper>
              <CapteursList
                capteursIds={capteursIds}
                capteursList={capteursList}
              />
            </FadeWrapper>
          ) : null}
        </div>
      )}
    </div>
  );
}
