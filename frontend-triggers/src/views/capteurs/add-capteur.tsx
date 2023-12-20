/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

import useFilesystem from "../../hooks/use-file-system";
import FormCapteurSettings from "../../components/form-capteur-settings";
import useHttp from "../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader";
import { Context } from "../../store/context-store";
import Sensor from "../../utils/types/sensor";

const AddCapteur = () => {
  const { readData } = useFilesystem();
  const { isLoading, error, sendRequest } = useHttp();
  const nav = useNavigate();
  const { addOneCapteur } = useContext(Context);

  const getData = async (identifiant: string) => {
    const response = await readData("capteurs.txt");
    const result = JSON.parse(response);
    if (!result.includes(identifiant)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmitCapteur = async (
    name: string,
    timer: number,
    threshold: number
  ) => {
    const applyData = (data: any) => {
      addOneCapteur(data);
      nav("/capteurs");
    };
    sendRequest(
      {
        path: "/sensor/${settings.id}",
        method: "post",
        body: { name, threshold, timer },
      },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error("Ce capteur n'est pas encore enregistré auprès du serveur");
    }
  }, [error]);

  return (
    <>
      <Toaster />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-8">
          <div className="w-full flex justify-start">
            <h1 className="font-bold text-xl text-primary underline">
              Ajouter un Capteur
            </h1>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <FormCapteurSettings onSubmit={handleSubmitCapteur} />
          )}
          <p className="w-4/6 text-info text-xs">
            * Le capteur doit être branché et connecté pour pouvoir être ajouté
            à la liste des capteurs
          </p>
        </div>
      </div>
    </>
  );
};

export default AddCapteur;
