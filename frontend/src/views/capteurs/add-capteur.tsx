import React from "react";
import { Toaster, toast } from "react-hot-toast";

import useFilesystem from "../../hooks/use-file-system";
import FormCapteurSettings from "../../components/form-capteur-settings";
import useHttp from "../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader";

const AddCapteur = () => {
  const { addCapteur, readData } = useFilesystem();
  const { isLoading, error, sendRequest } = useHttp();
  const nav = useNavigate();

  const getData = async (identifiant: string) => {
    const response = await readData("toto.txt");
    const result = JSON.parse(response);
    if (!result.includes(identifiant)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmitCapteur = async (
    id: string,
    timer: number,
    alerte: number
  ) => {
    if (await getData(id)) {
      addCapteur("capteurs.txt", id);
      toast.success("Capteur enregistré");
      updateCapteurSettings({
        id,
        timer,
        alerte,
      });
    } else {
      toast.error("Ce capteur est déjà enregistré");
    }
  };

  const updateCapteurSettings = (settings: {
    id: string;
    timer: number;
    alerte: number;
  }) => {
    const applyData = (data: any) => {
      nav(`/capteurs/details/${settings.id}`);
    };
    sendRequest(
      {
        path: "/update",
        method: "put",
        body: settings,
      },
      applyData
    );
  };

  console.log({ error });

  return (
    <>
      <Toaster />
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-8">
          <div className="w-full flex justify-start">
            <h1 className="font-bold text-xl text-primary">
              Ajouter un Capteur
            </h1>
          </div>
          {isLoading ? (
            <Loader />
          ) : (
            <FormCapteurSettings onSubmit={handleSubmitCapteur} />
          )}
        </div>
      </div>
    </>
  );
};

export default AddCapteur;
