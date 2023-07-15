import React, { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
  capteurId?: string;
};

const NoCapteurs: FC<Props> = ({ capteurId }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-between gap-y-8">
      <div className="flex flex-col items-center gap-y-16">
        <div className="flex flex-col items-center gap-y-1">
          {capteurId ? (
            <>
              <p className="text-sm text-info">
                Aucune donnée trouvée pour ce capteur
              </p>
              <Link className="text-xs text-warning underline" to="#">
                En savoir plus
              </Link>
            </>
          ) : (
            <p className="text-xl text-info">Aucun capteur n'a été trouvé</p>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-16 h-16 text-error"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"
          />
        </svg>
      </div>
      {capteurId ? (
        <p className="w-fit btn btn-primary no-animation text-xs">
          {capteurId}
        </p>
      ) : (
        <Link className="btn btn-primary" to="/capteurs/add">
          Enregistrer un capteur
        </Link>
      )}
    </div>
  );
};

export default NoCapteurs;
