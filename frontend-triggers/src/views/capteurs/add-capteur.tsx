/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { toast } from "react-hot-toast";

import FormCapteurSettings from "../../components/form-capteur-settings";
import useHttp from "../../hooks/use-http";
import { useNavigate } from "react-router-dom";

const AddCapteur = () => {
  const { isLoading, error, sendRequest } = useHttp();
  const nav = useNavigate();

  /**
   * Enregistre le capteur dans la bdd et redirection vers la page capteurs
   * @param name string
   * @param timer number
   * @param threshold number
   */
  const handleSubmitCapteur = async (
    name: string,
    timer: number,
    threshold: number
  ) => {
    const applyData = (_data: any) => {
      toast.success("Capteur enregistré !");
      nav("/capteurs");
    };
    sendRequest(
      {
        path: "/sensor",
        method: "post",
        body: { name, threshold, timer },
      },
      applyData
    );
  };

  console.log({ error });

  // gestion d'éventuelles erreurs
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-8">
          <div className="w-full flex justify-start">
            <h1 className="font-bold text-xl text-primary underline">
              Ajouter un Capteur
            </h1>
          </div>
          <FormCapteurSettings
            onSubmit={handleSubmitCapteur}
            isSubmitting={isLoading}
          />
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
