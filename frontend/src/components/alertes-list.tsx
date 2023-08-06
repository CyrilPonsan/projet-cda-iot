/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";

import Alerte from "../utils/types/alerte";
import AlerteItem from "./alerte-item";
import useList from "../hooks/use-list";
import SortColumnIcon from "./ui/sort-column-icon";
import AllReadButton from "./ui/all-read-button";
import AllDeleteButton from "./ui/all-delete-button";
import Pagination from "./ui/pagination";
import ModalDeleteAlerte from "./ui/modal-delete-alertes";

type Props = {
  alertes: Array<Alerte>;
  onDeleteItems: (deletedItems: Array<string>) => void;
  onUpdateItems: (updatedItems: Array<Alerte>) => void;
};

declare global {
  interface Window {
    my_modal_1: {
      showModal: () => void;
    };
  }
}

const AlertesList: FC<Props> = ({ alertes, onDeleteItems, onUpdateItems }) => {
  const {
    allChecked,
    list,
    direction,
    fieldSort,
    anySelected,
    page,
    totalPages,
    sortData,
    setAllChecked,
    handleRowCheck,
    setPage,
  } = useList(alertes, "date", 5);

  /**
   * gère le coache / décochage de toutes les checkboxes
   */
  const handleAllChecked = () => {
    setAllChecked((prevState) => !prevState);
  };

  const deleteItem = (id: string) => {
    onDeleteItems([id]);
  };

  const content = (
    <>
      {list
        ? list.map((alerte) => (
            <tr className="font-bold" key={alerte.id}>
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
        .filter((item) => !item.hasBeenSeen);
      onUpdateItems(updatedAlertes);
    }
  };

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
      <table className="table w-4/6">
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
              <div className="flex gap-x-4">
                <p>Status</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="hasBeenSeen"
                  direction={direction}
                />
              </div>
            </th>
            <th className="cursor-pointer" onClick={() => sortData("date")}>
              <div className="flex gap-x-4">
                <p>Date</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="date"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => sortData("capteurId")}
            >
              <div className="flex gap-x-4">
                <p>Identifiant</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="capteurId"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => sortData("txHumidite")}
            >
              <div className="flex gap-x-4">
                <p>Taux d'humidité</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="txHumidite"
                  direction={direction}
                />
              </div>
            </th>
            <th className="cursor-pointer">Action</th>
          </tr>
        </thead>
        <tbody>{content}</tbody>
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
      </table>
      {totalPages > 1 ? (
        <div className="w-4/6 flex justify-center mt-8"></div>
      ) : null}
      <ModalDeleteAlerte onConfirm={deleteAll} />
    </div>
  );
};

export default AlertesList;
