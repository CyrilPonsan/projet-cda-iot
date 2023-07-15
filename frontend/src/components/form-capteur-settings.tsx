import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";

import Capteur from "../utils/types/capteur";
import { regexGeneric, regexNumber } from "../utils/reg-ex";
import useInput from "../hooks/use-input";

type Props = {
  capteur?: Capteur;
  label?: string;
  onSubmit: (identifiant: string, refreshRate: number, seuil: number) => void;
};

const FormCapteurSettings: FC<Props> = ({
  capteur,
  label = "Enregistrer",
  onSubmit,
}) => {
  const { value: identifiant } = useInput((value) => regexGeneric.test(value));
  const [refreshRate, setRefreshRate] = useState<number | null>(null);
  const { value: seuil } = useInput((value) => regexNumber.test(value), "25");

  const handleChangeRefreshRate = (event: ChangeEvent<HTMLSelectElement>) => {
    setRefreshRate(parseInt(event.target.value) * 1000 * 3600);
  };

  const inputStyle = (value: boolean) => {
    return `input input-bordered ${
      !value ? "input-primary" : "input-error"
    } w-full focus:outline-none`;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (identifiant.isValid && refreshRate) {
      onSubmit(identifiant.value, refreshRate, seuil.value);
    }
  };

  useEffect(() => {
    if (!capteur) {
      setRefreshRate(24 * 1000 * 3600);
    } else {
      setRefreshRate(capteur.timer);
    }
  }, [capteur]);

  return (
    <>
      {refreshRate ? (
        <form
          className="flex flex-col justify-center items-center gap-y-8"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col gap-y-4 mt-4">
            <label>Identifiant du capteur</label>
            <input
              className={inputStyle(identifiant.hasError)}
              type="text"
              placeholder="Identifiant"
              defaultValue={identifiant.value}
              onChange={identifiant.valueChangeHandler}
              onBlur={identifiant.valueBlurHandler}
            />
          </div>

          <div className="flex gap-x-4 items-center">
            <label htmlFor="refreshRate">Fréquence des relevés</label>
            <select
              className="select select-bordered select-primary focus:outline-none"
              value={refreshRate / (1000 * 3600)}
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
              {label}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
};

export default FormCapteurSettings;
