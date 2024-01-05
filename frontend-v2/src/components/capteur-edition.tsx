/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";

import Sensor from "../utils/types/sensor";
import useHttp from "../hooks/use-http";
import FormCapteurSettings from "./form-capteur-settings";

interface CapteurEditionProps {
  capteur: Sensor;
  onToggleEdit: () => void;
  onUpdateCapteur: (updatedCapteur: Sensor) => void;
}

export default function CapteurEdition({
  capteur,
  onToggleEdit,
  onUpdateCapteur,
}: CapteurEditionProps) {
  const { isLoading, error, sendRequest } = useHttp();

  const handleSubmit = async (
    name: string,
    timer: number,
    threshold: number
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const applyData = (_data: any) => {
      toast.success("Capteur mis à jour !");
      onUpdateCapteur({
        ...capteur,
        name,
        threshold,
        timer,
      });
    };
    sendRequest(
      {
        path: `/sensor/${capteur.id}`,
        method: "put",
        body: { name, threshold, timer },
      },
      applyData
    );
  };

  // gestion d'éventuelles erreurs
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-8">
        <div className="w-full flex justify-start gap-x-4">
          <button
            className="btn btn-sm btn-primary btn-circle"
            onClick={onToggleEdit}
          >
            <ChevronLeft />
          </button>
          <h1 className="font-bold text-xl text-primary">
            Mise à jour des paramètres
          </h1>
        </div>
        <FormCapteurSettings
          label="Enregistrer les modifications"
          capteur={capteur}
          isSubmitting={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
