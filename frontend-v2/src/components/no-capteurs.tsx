import { FC } from "react";
import { Link } from "react-router-dom";

import { ZapOff } from "lucide-react";

type Props = {
  capteurId?: string;
};

const NoCapteurs: FC<Props> = ({ capteurId }) => {
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-between gap-y-8">
        <div className="flex flex-col items-center gap-y-16">
          <div className="flex flex-col items-center gap-y-1">
            <p className="text-xl text-info">Aucun capteur n'a été trouvé</p>
          </div>
          <ZapOff className="text-error" />
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
    </>
  );
};

export default NoCapteurs;
