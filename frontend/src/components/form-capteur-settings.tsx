import React, { ChangeEvent, FC, useState } from "react";
import Capteur from "../utils/types/capteur";
import { regexNumber } from "../utils/reg-ex";
import useInput from "../hooks/use-input";

type Props = {
  capteur: Capteur;
  onSubmitSettings: (refreshRate: number, seuil: number) => void;
};

const FormCapteurSettings: FC<Props> = ({ capteur, onSubmitSettings }) => {
  const [refreshRate, setRefreshRate] = useState(capteur.refreshRate);
  const { value: seuil } = useInput((value) => regexNumber.test(value), "25");

  const handleChangeRefreshRate = (event: ChangeEvent<HTMLSelectElement>) => {
    setRefreshRate(parseInt(event.target.value) * 1000 * 3600);
  };

  return (
    <form>
      <div className="flex gap-x-4 items-center">
        <label htmlFor="refreshRate">Fréquence des relevés</label>
        <select
          className="select select-bordered select-primary focus:outline-none"
          onChange={handleChangeRefreshRate}
        >
          <option value="24">24 heures</option>
          <option value="12">12 heures</option>
          <option value="6">6 heures</option>
          <option value="3">3 heures</option>
          <option value="1">1 heure</option>
        </select>
      </div>

      <div className="flex gap-x-4 items-center">
        <label htmlFor="seuil">Taux d'humidité minimum</label>
        <input
          className="input w-24 input-bordered input-primary focus:outline-none"
          type="number"
          min={0}
          max={100}
          defaultValue={seuil.value}
          onChange={seuil.valueChangeHandler}
          onBlur={seuil.valueBlurHandler}
        />
      </div>

      <div className="w-full flex justify-end">
        <button className="btn btn-primary" type="submit">
          Mettre à jour
        </button>
      </div>
    </form>
  );
};

export default FormCapteurSettings;
