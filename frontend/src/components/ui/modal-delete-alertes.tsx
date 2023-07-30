import React, { FC } from "react";

import Portal from "./portal";

type Props = {
  onConfirm: () => void;
};

const ModalDeleteAlerte: FC<Props> = ({ onConfirm }) => {
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
              Suppression des alertes
            </h3>
            <p className="text-md py-4">
              Confirmer la suppression des alertes sélectionnées
            </p>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-outline border-none underline">
                Annuler
              </button>
              <button className="btn btn-sm btn-primary" onClick={onConfirm}>
                Confirmer
              </button>
            </div>
          </form>
        </dialog>
      </Portal>
    </div>
  );
};

export default ModalDeleteAlerte;
