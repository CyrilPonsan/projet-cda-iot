import React, { useCallback, useEffect, useState } from "react";

import Capteur from "../../utils/types/capteur";
import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import useFilesystem from "../../hooks/use-file-system";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Capteur> | null>(null);
  const { isLoading, error, sendRequest } = useHttp();
  const { readData } = useFilesystem();

  console.log({ isLoading });

  useEffect(() => {
    if (error.length !== 0) {
      setCapteursList(null);
    }
  }, [error]);

  const fetchHumidityRate = useCallback(
    (capteursIds: Array<string>) => {
      const applyData = (data: Capteur) => {
        setCapteursList((prevList: any) => [...prevList, data]);
      };
      capteursIds.forEach((item) =>
        sendRequest(
          {
            path: `/one-capteur?capteurId=${item}`,
          },
          applyData
        )
      );
    },
    [sendRequest]
  );

  const getData = useCallback(async () => {
    const result = await readData("toto.txt");
    fetchHumidityRate(JSON.parse(result));
  }, [readData, fetchHumidityRate]);

  useEffect(() => {
    setCapteursList([]);

    getData();
  }, [getData]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 h-full w-full flex flex-col items-between text-lg justify-center">
      <div className="h-full w-full flex flex-col items-center">
        <div className="w-full h-full">
          {error.length !== 0 ? (
            <div className="w-full h-full flex flex-col gap-y-8 justify-center items-center">
              <p className="text-error font-medium">{error}</p>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {}}
              >
                Réessayer
              </button>
            </div>
          ) : isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <div className="w-full h-full flex justify-center items-center">
              {!capteursList || capteursList.length === 0 ? (
                <FadeWrapper>
                  <NoCapteurs />
                </FadeWrapper>
              ) : capteursList && capteursList.length !== 0 ? (
                <FadeWrapper>
                  <CapteursList capteursList={capteursList} />
                </FadeWrapper>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
