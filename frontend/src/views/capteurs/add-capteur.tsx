import React from "react";
import { Toaster, toast } from "react-hot-toast";

import useFilesystem from "../../hooks/use-file-system";
import FormCapteurSettings from "../../components/form-capteur-settings";

const AddCapteur = () => {
  const { addCapteur, readData } = useFilesystem();

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
    identifiant: string,
    refreshRate: number,
    seuil: number
  ) => {
    if (await getData(identifiant)) {
      addCapteur("toto.txt", identifiant);
      toast.success("Capteur enregistré");
    } else {
      toast.error("Ce capteur est déjà enregistré");
    }
  };

  return (
    <>
      <Toaster />
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-4">
          <div className="w-full flex justify-start">
            <h1 className="font-bold text-xl text-primary">
              Ajouter un Capteur
            </h1>
          </div>
          <FormCapteurSettings onSubmit={handleSubmitCapteur} />
        </div>
      </div>
    </>
  );
};

export default AddCapteur;
