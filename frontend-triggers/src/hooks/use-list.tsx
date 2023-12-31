/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { sortArray } from "../utils/sortArray";
import { getPagination } from "../utils/get-pagination";

const useList = (
  initialList: Array<any>,
  defaultSort: string,
  limit: number
) => {
  const [list, setList] = useState<Array<any> | null>(initialList); // liste temporaire des objets à afficher
  const [page, setPage] = useState(1); //  numéro de la page affichée
  const [totalPages, setTotalPages] = useState<number>(0);
  const [allChecked, setAllChecked] = useState(false);
  const [fieldSort, setFieldSort] = useState<string>(defaultSort);
  const [direction, setDirection] = useState<boolean>(false);
  const [anySelected, setAnySelected] = useState<boolean>(false);

  /**
   * gère le cochage décochage d'une row individuelle
   * @param id string
   */
  const handleRowCheck = (id: string) => {
    setList((prevList: any) =>
      prevList.map((item: any) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  /**
   * retourne la liste des objets qui ont la propriété isSelected égale à true
   * @returns Array<any>
   */
  const getSelecteditems = () => {
    return list?.filter((item: any) => item.isSelected);
  };

  /**
   * filtre la liste d'objets en fonction des filtes
   */
  const getFilteredList = useCallback(
    (filters: Array<{ field: string; value: string }>) => {
      let filteredList = initialList;
      // on applique chaque filtre sur la liste créée par l'utilisation précédente de la fonction filter
      filters.forEach((filter) => {
        filteredList = filteredList.filter(
          (item) => item[filter.field] === filter.value
        );
      });
      // on attribue la liste réduite par les applications successives des filtres au state "list"
      setList(filteredList);
    },
    [initialList]
  );

  /**
   * extration des différentes valeurs de la liste d'objets par propriété
   */
  const getFieldValues = useCallback(
    (field: string) => {
      const values = Array<string>();
      initialList?.forEach((item: any) => {
        // si la valeur n'est pas déja présente dans le tableau on l'y ajoute
        if (!values.includes(item[field])) {
          values.push(item[field]);
        }
      });
      return values;
    },
    [initialList]
  );

  /**
   * réinitialise le state "list" avec la valeur de "initialList" et uncheck toutes les checkboxes de la liste
   */
  const resetFilters = useCallback(() => {
    setAllChecked(false);
    setList(initialList);
  }, [initialList]);

  const sortData = (column: string) => {
    if (column === fieldSort) {
      setDirection((prevDirection) => !prevDirection);
    } else {
      setFieldSort(column);
      setDirection(true);
    }
  };

  useEffect(() => {
    if (list) {
      const itemSelected = list.find((item: any) => item.isSelected);
      setAnySelected(itemSelected ? true : false);
    }
  }, [list]);

  /**
   * tri de la liste lors du montage du composant et en fonction des actions de l'utilisateur
   */
  useEffect(() => {
    setList((prevList: any) => {
      if (prevList && prevList.length !== 0) {
        return sortArray(prevList, fieldSort, direction);
      } else {
        return null;
      }
    });
  }, [fieldSort, direction]);

  /**
   * modifie le contenu de la liste des objets à afficher en fonction des action de l'utlisateur (changement de page)
   */
  useEffect(() => {
    setAllChecked(false);
    const offset = getPagination(page, limit);
    setList(initialList.slice(offset, offset + limit));
  }, [initialList, limit, page]);

  /**
   * gère le cochage / décochage de toutes les rows de la liste
   */
  useEffect(() => {
    setList((prevList: any) =>
      prevList.map((item: any) => ({ ...item, isSelected: allChecked }))
    );
  }, [allChecked]);

  /**
   * calcul le nombre total de page pour déterminer si un chamgement de page est possible
   */
  useEffect(() => {
    if (initialList) {
      setTotalPages(Math.ceil(initialList.length / limit));
    }
  }, [initialList, limit]);

  return {
    allChecked,
    list,
    page,
    totalPages,
    fieldSort,
    direction,
    anySelected,
    setAllChecked,
    setPage,
    handleRowCheck,
    getSelecteditems,
    getFilteredList,
    getFieldValues,
    resetFilters,
    sortData,
  };
};

export default useList;
