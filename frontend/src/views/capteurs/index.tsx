import React, { useCallback, useEffect, useState } from "react";

import Capteur from "../../utils/types/capteur";
import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import useFilesystem from "../../hooks/useFileSystem";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Capteur> | null>(null);
  const { isLoading, error, sendRequest } = useHttp();
  const { readData } = useFilesystem();

  useEffect(() => {
    if (error.length !== 0) {
      setCapteursList(null);
    }
  }, [error]);

  const fetchHumidityRate = useCallback(
    (capteursIds: Array<string>) => {
      const applyData = (data: any) => {
        setCapteursList(data);
      };
      sendRequest(
        {
          path: "/get",
          method: "post",
          body: capteursIds,
        },
        applyData
      );
    },
    [sendRequest]
  );

  useEffect(() => {
    const getData = async () => {
      const result = await readData("toto.txt");
      fetchHumidityRate(result);
    };
    getData();
  }, [readData, fetchHumidityRate]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 h-full w-full flex flex-col items-between text-lg justify-center">
      <div className="h-full w-full flex flex-col items-center">
        <div className="w-full h-full">
          {error.length !== 0 ? (
            <div className="flex flex-col justify-center items-center gap-y-4">
              <p className="text-error">{error}</p>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {}}
              >
                Réessayer
              </button>
            </div>
          ) : null}
          {isLoading ? (
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
              ) : (
                <FadeWrapper>
                  <CapteursList capteursList={capteursList} />
                </FadeWrapper>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
