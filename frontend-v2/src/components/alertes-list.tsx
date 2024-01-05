/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

import AlerteItem from "./alerte-item";
import SortColumnIcon from "./ui/sort-column-icon";
import AllReadButton from "./ui/all-read-button";
import AllDeleteButton from "./ui/all-delete-button";
import Pagination from "./ui/pagination";
import ModalDeleteAlerte from "./ui/modal-delete-alertes";

type Props = {
  allChecked: boolean;
  list: any[];
  direction: boolean;
  field: string;
  anySelected: boolean;
  page: number;
  totalPages: number;
  isSubmitting: boolean;
  sortData: (column: string) => void;
  setAllChecked: (value: any) => void;
  handleRowCheck: (id: number) => void;
  setPage: (value: number) => void;
  onDeleteItems: (deletedItems: Array<number>) => void;
  onUpdateItems: (updatedItems: Array<number>) => void;
};

declare global {
  interface Window {
    my_modal_1: {
      showModal: () => void;
    };
  }
}

const AlertesList: FC<Props> = ({
  isSubmitting,
  list,
  allChecked,
  direction,
  field,
  anySelected,
  page,
  totalPages,
  sortData,
  setAllChecked,
  handleRowCheck,
  setPage,
  onDeleteItems,
  onUpdateItems,
}) => {
  /**
   * gère le cochage / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState: any) => !prevState);
  };

  const deleteItem = (id: number) => {
    onDeleteItems([id]);
  };

  const content = (
    <>
      {list
        ? list.map((alerte) => (
            <tr className="font-bold hover" key={alerte.id}>
              <AlerteItem
                alerte={alerte}
                onRowCheck={handleRowCheck}
                onDeleteItem={deleteItem}
              />
            </tr>
          ))
        : null}
    </>
  );

  /**
   * créé un tableau d'alertes ayant la propréité isSelected = true et le transmet au composant parent
   */
  const updateAll = () => {
    if (list) {
      const updatedAlertes = list
        .filter((alerte: any) => alerte.isSelected)
        .filter((item) => !item.hasBeenSeen)
        .map((item) => item.id);
      onUpdateItems(updatedAlertes);
    }
  };

  /**
   * ordonne au compo parent de supprimer les alertes sélectionnées
   */
  const deleteAll = () => {
    if (list) {
      const updatedAlertes = list
        .filter((alerte: any) => alerte.isSelected)
        .map((item) => item.id);
      onDeleteItems(updatedAlertes);
    }
  };

  return (
    <div>
      <div
        className={`${
          anySelected ? "visible" : "invisible"
        } flex items-center gap-x-4 pl-4 mb-8`}
      >
        <AllReadButton onClickEvent={updateAll} />
        <AllDeleteButton onClickEvent={() => window.my_modal_1?.showModal()} />
      </div>
      <table className="table">
        <thead>
          <tr className="text-primary">
            <th>
              <input
                className="my-auto checkbox checkbox-sm rounded-md checkbox-primary flex justify-center items-center"
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
            </th>
            <th
              className="cursor-pointer"
              onClick={() => sortData("hasBeenSeen")}
            >
              <div className="flex gap-x-4 items-center">
                <p>Status</p>
                <SortColumnIcon
                  field={field}
                  column="hasBeenSeen"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => sortData("createdAt")}
            >
              <div className="flex gap-x-4 items-center">
                <p>Date</p>
                <SortColumnIcon
                  field={field}
                  column="createdAt"
                  direction={direction}
                />
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => sortData("name")}>
              <div className="flex gap-x-4 items-center">
                <p>Identifiant</p>
                <SortColumnIcon
                  field={field}
                  column="name"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => sortData("txHumidite")}
            >
              <div className="flex gap-x-4 items-center">
                <p>Taux d'humidité</p>
                <SortColumnIcon
                  field={field}
                  column="humidityLevel"
                  direction={direction}
                />
              </div>
            </th>
            <th className="cursor-pointer">Action</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
        {totalPages > 1 ? (
          <tfoot>
            <tr>
              <th colSpan={3}></th>
              <th>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              </th>
            </tr>
          </tfoot>
        ) : null}
      </table>
      <ModalDeleteAlerte isSubmitting={isSubmitting} onConfirm={deleteAll} />
    </div>
  );
};

export default AlertesList;
