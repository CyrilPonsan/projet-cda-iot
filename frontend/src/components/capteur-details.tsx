import React, { FC } from "react";

import Capteur from "../utils/types/capteur";
import EditLink from "./ui/edit-link";
import DeleteButton from "./ui/delete-button";
import BackButton from "./ui/back-button";
import ModalRemoveCapteur from "./ui/modal-remove-capteur";

type Props = {
  capteur: Capteur;
};

const CapteurDetails: FC<Props> = ({ capteur }) => {
  return (
    <>
      <div>
        <div className="w-full flex flex-col items-start gap-y-12">
          <div className="w-full md:5/6 flex justify-center md:justify-start items-center gap-x-4">
            <BackButton />
            <div className="flex flex-col text-primary">
              <h3 className="text-xs">Détails du capteur</h3>
              <h2 className="text-xl font-bold">{capteur.id}</h2>
            </div>
          </div>
          <div className="w-full font-medium flex flex-col items-start">
            <span className="w-full flex justify-between gap-x-4">
              <p>Ajouté le:</p>
              <p className="text-info">
                {new Date(capteur.date).toLocaleDateString()}
              </p>
            </span>
            <span className="w-full flex justify-between gap-x-4">
              <p>Fréquence des relevés:</p>
              <p className="text-info">{capteur.timer / 3600} h</p>
            </span>
            <span className="w-full flex justify-between gap-x-4">
              <p>Seuil d'alerte:</p>
              <p className="text-info">{capteur.alerte} %</p>
            </span>
          </div>
          <div className="w-full flex justify-center gap-x-8">
            <div
              className="tooltip tooltip-bottom"
              data-tip="Modifier les paramètres"
            >
              <EditLink id={capteur.id} />
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
      <ModalRemoveCapteur capteurId={capteur.id} />
    </>
  );
};

export default CapteurDetails;
