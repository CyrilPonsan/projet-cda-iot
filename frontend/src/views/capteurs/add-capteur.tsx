import React, { FormEvent } from "react";

import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/reg-ex";
import useFilesystem from "../../hooks/use-file-system";

const capteurs = ["AC:0B:FB:DA:55:23"];

const AddCapteur = () => {
  const { value: identifiant } = useInput((value) => regexGeneric.test(value));
  const { addCapteur } = useFilesystem();

  const handleSubmitCapteur = (event: FormEvent) => {
    event.preventDefault();
    if (identifiant.isValid) {
      addCapteur("toto.txt", capteurs[0]);
    } else {
      console.log("oops");
    }
  };

  const inputStyle = (value: boolean) => {
    return `input input-bordered ${
      !value ? "input-primary" : "input-error"
    } w-full focus:outline-none`;
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-4/6 h-full flex justify-start flex-col">
        <div className="flex items-start mt-8">
          <h1 className="font-bold text-xl">Ajouter un Capteur</h1>
        </div>
        <div className="h-full flex justify-center items-center">
          <form
            className="flex flex-col justify-center items-center gap-y-8"
            onSubmit={handleSubmitCapteur}
          >
            <div className="w-full flex flex-col gap-y-2">
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

            <div className="w-full flex justify-end">
              <button className="btn btn-primary" type="submit">
                Chercher
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCapteur;
