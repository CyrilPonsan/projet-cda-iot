import React, { FC } from "react";

import Capteur from "../utils/types/capteur";
import EditIcon from "./ui/svg/edit-icon";
import TrashIcon from "./ui/svg/trash-icons";

type Props = {
  capteur: Capteur;
};

const CapteurDetails: FC<Props> = ({ capteur }) => {
  console.log({ capteur });

  return (
    <div>
      <div className="flex flex-col items-start gap-y-12">
        <div className="w-3/6 md:5/6 flex justify-center md:justify-start">
          <h2 className="text-xl text-primary font-bold">{capteur.id}</h2>
        </div>
        <div className="w-full font-medium flex flex-col items-start">
          <span className="w-3/6 md:w-5/6 flex justify-between gap-x-4">
            <p>Ajouté le:</p>
            <p className="text-primary">
              {new Date(capteur.date).toLocaleDateString()}
            </p>
          </span>
          <span className="w-3/6 md:w-5/6 flex justify-between gap-x-4">
            <p>Fréquence des relevés:</p>
            <p className="text-primary">{capteur.timer / 3600} h</p>
          </span>
          <span className="w-3/6 md:w-5/6 flex justify-between gap-x-4">
            <p>Seuil d'alerte:</p>
            <p className="text-primary">{capteur.alerte} %</p>
          </span>
        </div>
        <div className="w-3/6 md:w-5/6 flex justify-center gap-x-8">
          <div
            className="tooltip tooltip-bottom"
            data-tip="Modifier les paramètres"
          >
            <button className="btn btn-secondary btn-circle">
              <div className="text-white">
                <EditIcon />
              </div>
            </button>
          </div>
          <div
            className="tooltip tooltip-bottom"
            data-tip="Supprimer le capteur"
          >
            <button className="btn btn-secondary btn-circle">
              <div className="text-white">
                <TrashIcon />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapteurDetails;
