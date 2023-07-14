import React, { ChangeEvent, FormEvent, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import useInput from "../../hooks/use-input";
import { regexGeneric, regexNumber } from "../../utils/reg-ex";
import useFilesystem from "../../hooks/use-file-system";

const capteurs = ["AC:0B:FB:DA:55:23"];

const AddCapteur = () => {
  const { value: identifiant } = useInput((value) => regexGeneric.test(value));
  const [refreshRate, setRefreshRate] = useState(24);
  const { value: seuil } = useInput((value) => regexNumber.test(value), "25");
  const { addCapteur, readData } = useFilesystem();

  const getData = async () => {
    const response = await readData("toto.txt");
    const result = JSON.parse(response);
    if (!result.includes(identifiant.value)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSubmitCapteur = async (event: FormEvent) => {
    event.preventDefault();
    if (identifiant.isValid && (await getData())) {
      addCapteur("toto.txt", capteurs[0]);
      toast.success("Capteur enregistré");
    } else {
      toast.error("Ce capteur est déjà enregistré");
      console.log("oops");
    }
  };

  const inputStyle = (value: boolean) => {
    return `input input-bordered ${
      !value ? "input-primary" : "input-error"
    } w-full focus:outline-none`;
  };

  const handleChangeRefreshRate = (event: ChangeEvent<HTMLSelectElement>) => {
    setRefreshRate(parseInt(event.target.value));
  };

  return (
    <>
      <Toaster />
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start">
          <form
            className="flex flex-col justify-center items-center gap-y-8"
            onSubmit={handleSubmitCapteur}
          >
            <div className="w-full flex justify-start">
              <h1 className="font-bold text-xl text-primary">
                Ajouter un Capteur
              </h1>
            </div>

            <div className="w-full flex flex-col gap-y-2 mt-4">
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
                value={refreshRate}
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
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddCapteur;
