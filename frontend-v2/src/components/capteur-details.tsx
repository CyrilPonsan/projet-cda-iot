import { FC, useEffect } from "react";
import { Pencil } from "lucide-react";

import DeleteButton from "./ui/delete-button";
import BackButton from "./ui/back-button";
import ModalRemoveCapteur from "./ui/modal-remove-capteur";
import Sensor from "../utils/types/sensor";
import { localeDate } from "../helpers/locale-datetime";
import useHttp from "../hooks/use-http";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  capteur: Sensor;
  onToggleEditMode: () => void;
};

const CapteurDetails: FC<Props> = ({ capteur, onToggleEditMode }) => {
  const { sendRequest, isLoading, error } = useHttp();
  const nav = useNavigate();

  const handleDeleteCapteur = () => {
    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      nav("/capteurs");
    };
    sendRequest(
      {
        path: `/sensor/${capteur.id}`,
        method: "delete",
      },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <div>
        <div className="w-full flex flex-col items-start gap-y-12">
          <div className="w-full md:5/6 flex justify-center md:justify-start items-center gap-x-4">
            <BackButton />
            <div className="flex flex-col text-primary">
              <h3 className="text-xs">Détails du capteur</h3>
              <h2 className="text-xl font-bold capitalize">{capteur.name}</h2>
            </div>
          </div>
          <div className="w-full font-medium flex flex-col items-start">
            <span className="w-full flex justify-between gap-x-4">
              <p>Ajouté le:</p>
              <p className="text-info">
                {localeDate(capteur.sensorCreatedAt ?? "")}
              </p>
            </span>
            <span className="w-full flex justify-between gap-x-4">
              <p>Fréquence des relevés:</p>
              <p className="text-info">{capteur.timer} h</p>
            </span>
            <span className="w-full flex justify-between gap-x-4">
              <p>Seuil d'alerte:</p>
              <p className="text-info">{capteur.threshold} %</p>
            </span>
          </div>
          <div className="w-full flex justify-center gap-x-8">
            <div
              className="tooltip tooltip-bottom"
              data-tip="Modifier les paramètres"
            >
              <button
                className="btn btn-primary btn-circle"
                onClick={onToggleEditMode}
              >
                <Pencil />
              </button>
            </div>
            <div
              className="tooltip tooltip-bottom"
              data-tip="Supprimer le capteur"
            >
              <DeleteButton onDelete={() => window.my_modal_1.showModal()} />
            </div>
          </div>
        </div>
      </div>
      <ModalRemoveCapteur
        name={capteur.name}
        isSubmitting={isLoading}
        onDeleteCapteur={handleDeleteCapteur}
      />
    </>
  );
};

export default CapteurDetails;
