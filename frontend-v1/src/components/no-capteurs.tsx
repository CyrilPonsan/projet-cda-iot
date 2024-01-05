import { FC } from "react";
import { Link } from "react-router-dom";

import NotConnectedIcon from "./ui/svg/not-connected-icon";
import ModalRemoveCapteur from "./ui/modal-remove-capteur";

type Props = {
  capteurId?: string;
};

const NoCapteurs: FC<Props> = ({ capteurId }) => {
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between gap-y-8">
        <div className="flex flex-col items-center gap-y-16">
          <div className="flex flex-col items-center gap-y-1">
            {capteurId ? (
              <>
                <p className="text-sm text-info">
                  Aucune donnée pour ce capteur
                </p>
                <div className="flex gap-x-4 text-xs">
                  <Link className="text-warning hover:underline" to="#">
                    En savoir plus
                  </Link>
                  <p
                    className="text-error hover:underline cursor-pointer"
                    onClick={() => window.my_modal_1.showModal()}
                  >
                    Supprimer
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xl text-info">Aucun capteur n'a été trouvé</p>
            )}
          </div>
          <div className="text-error">
            <NotConnectedIcon />
          </div>
        </div>
        {capteurId ? (
          <Link
            className="w-fit btn btn-primary no-animation text-xs"
            to={`/capteurs/details/${capteurId}`}
          >
            {capteurId}
          </Link>
        ) : (
          <Link className="btn btn-primary" to="/capteurs/add">
            Enregistrer un capteur
          </Link>
        )}
      </div>
      {capteurId ? <ModalRemoveCapteur capteurId={capteurId} /> : null}
    </>
  );
};

export default NoCapteurs;
