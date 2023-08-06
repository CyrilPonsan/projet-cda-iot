import { FC, useContext } from "react";

import Portal from "./portal";
import useFilesystem from "../../hooks/use-file-system";
import { useNavigate } from "react-router-dom";
import { Context } from "../../store/context-store";

type Props = {
  capteurId: string;
};

const ModalRemoveCapteur: FC<Props> = ({ capteurId }) => {
  const { deleteCapteur } = useFilesystem();
  const nav = useNavigate();
  const { removeCapteur } = useContext(Context);

  const handleRemoveCapteur = async (id: string) => {
    await deleteCapteur("capteurs.txt", id);
    removeCapteur(id);
    nav("/capteurs");
  };

  return (
    <div>
      {/* Open the modal using ID.showModal() method */}
      <Portal>
        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <p className="text-primary lowercase">x</p>
            </button>
            <h3 className="font-bold text-sm text-primary uppercase">
              {capteurId}
            </h3>
            <p className="text-md py-4">Confirmer la suppression du capteur</p>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-outline border-none underline">
                Annuler
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => {
                  handleRemoveCapteur(capteurId);
                }}
              >
                Confirmer
              </button>
            </div>
          </form>
        </dialog>
      </Portal>
    </div>
  );
};

export default ModalRemoveCapteur;
