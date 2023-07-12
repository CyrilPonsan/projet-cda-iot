import React from "react";
import { Link } from "react-router-dom";

const NoCapteurs = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      <h2 className="text-xl font-bold">Aucun capteur d'enregistré</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-24 h-24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21"
        />
      </svg>
      <Link className="btn btn-primary" to="/capteurs/add">
        Ajouter un capteur
      </Link>
    </div>
  );
};

export default NoCapteurs;
