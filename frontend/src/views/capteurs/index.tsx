import { useCallback, useContext, useEffect, useState } from "react";

import Capteur from "../../utils/types/capteur";
import useHttp from "../../hooks/use-http";
import FadeWrapper from "../../components/ui/fade-wrapper/fade-wrapper";
import CapteursList from "../../components/capteurs-list";
import NoCapteurs from "../../components/no-capteurs";
import useFilesystem from "../../hooks/use-file-system";
import Loader from "../../components/ui/loader";
import { Context } from "../../store/context-store";

export default function CapteursListPage() {
  const [capteursList, setCapteursList] = useState<Array<Capteur>>([]);
  const { capteursIds, addCapteurs } = useContext(Context);
  const { isLoading, sendRequest } = useHttp();
  const { readData } = useFilesystem();

  /**
   * récupération des données des capteurs depuis la bdd
   */
  const fetchHumidityRate = useCallback(
    (capteursIds: Array<string>) => {
      const applyData = (data: Capteur) => {
        console.log({ data });

        setCapteursList((prevList) => {
          if (!prevList.find((item) => item.id === data.id)) {
            return [...prevList, data];
          }
          return [...prevList];
        });
      };
      console.log({ capteursIds });

      capteursIds.forEach((capteur) =>
        sendRequest(
          {
            path: `/humidite/get?capteurId=${capteur}`,
          },
          applyData
        )
      );
    },
    [sendRequest]
  );

  /**
   * récupération de la liste des capteurs stockés dans le fs
   */
  const getData = useCallback(async () => {
    const result = await readData("capteurs.txt");
    addCapteurs(JSON.parse(result));
  }, [addCapteurs, readData]);

  useEffect(() => {
    if (capteursIds.length > 0) {
      fetchHumidityRate(capteursIds);
    }
  }, [capteursIds, fetchHumidityRate]);

  // si la liste des capteurs stockés en mémoire est vide on demande à récupérer la liste depuis le fs
  useEffect(() => {
    if (capteursIds.length === 0) {
      getData();
    }
  }, [capteursIds, getData]);

  return (
    <div className="bg-gradient-to-b from-secondary-800 to-secondary-700 text-lg flex justify-center items-center w-full h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          {!capteursList || capteursList.length === 0 ? (
            <FadeWrapper>
              <NoCapteurs />
            </FadeWrapper>
          ) : capteursList.length > 0 ? (
            <FadeWrapper>
              <CapteursList capteursList={capteursList} />
            </FadeWrapper>
          ) : null}
        </div>
      )}
    </div>
  );
}
