import { FC } from "react";
import { Loader2 } from "lucide-react";

import Portal from "./portal";

type Props = {
  isSubmitting: boolean;
  onConfirm: () => void;
};

const ModalDeleteAlerte: FC<Props> = ({ isSubmitting, onConfirm }) => {
  return (
    <div>
      {/* Open the modal using ID.showModal() method */}
      <Portal>
        {" "}
        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <p className="text-primary lowercase">x</p>
            </button>
            <h3 className="font-bold text-sm text-primary uppercase">
              Suppression des alertes
            </h3>
            <p className="text-md py-4">
              Confirmer la suppression des alertes sélectionnées
            </p>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-outline border-none underline"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                className="btn btn-sm btn-primary"
                disabled={isSubmitting}
                onClick={onConfirm}
              >
                <span className="flex items-center gap-x-2">
                  {isSubmitting ? (
                    <Loader2 className="animate animate-spin" />
                  ) : null}
                  <p>Confirmer</p>
                </span>
              </button>
            </div>
          </form>
        </dialog>
      </Portal>
    </div>
  );
};

export default ModalDeleteAlerte;
