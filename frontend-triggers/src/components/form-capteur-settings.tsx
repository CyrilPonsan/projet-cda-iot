import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { ZodError } from "zod";

import Sensor from "../utils/types/sensor";
import Field from "./ui/forms/field";
import useForm from "./ui/forms/hooks/use-form";
import FieldNumber from "./ui/forms/field-number";
import { sensorSchema } from "../lib/validation/sensor-schema";
import { regexNumber } from "../utils/reg-ex";
import { validationErrors } from "../helpers/validate";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  capteur?: Sensor;
  label?: string;
  isSubmitting: boolean;
  onSubmit: (name: string, timer: number, threshold: number) => void;
};

const FormCapteurSettings: FC<Props> = ({
  capteur,
  label = "Enregistrer",
  isSubmitting,
  onSubmit,
}) => {
  const { values, initValues, errors, onValidationErrors, onChangeValue } =
    useForm();
  const [refreshRate, setRefreshRate] = useState<number | null>(null);

  const data = {
    values,
    onChangeValue,
    errors,
  };

  // mise à jour du timer
  const handleChangeRefreshRate = (event: ChangeEvent<HTMLSelectElement>) => {
    setRefreshRate(parseInt(event.target.value) * 3600);
  };

  // validation et soumission du formulaire
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onValidationErrors([]);
    try {
      sensorSchema.parse({
        name: values.name,
        threshold: +values.threshold,
      });
      if (refreshRate && regexNumber.test(refreshRate.toString())) {
        onSubmit(values.name, refreshRate, +values.threshold);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log({ error });
        const errors = validationErrors(error);
        onValidationErrors(errors);
        toast.error(errors[0].message);
        return;
      }
    }
  };

  // initialisation des valeurs, soit on ajoute un capteur, soit on le met à jour
  useEffect(() => {
    if (capteur !== undefined) {
      initValues(capteur);
      setRefreshRate(capteur.timer);
    } else {
      setRefreshRate(24);
    }
  }, [capteur, initValues]);

  return (
    <>
      {refreshRate ? (
        <form
          className="w-4/6 2xl:w-2/6 flex flex-col justify-center items-start gap-y-8"
          onSubmit={handleSubmit}
        >
          <Field
            label="Nom du capteur"
            name="name"
            placeholder="Geranium"
            data={data}
          />

          <div className="w-full flex justify-between gap-x-4 items-center">
            <label htmlFor="refreshRate">Fréquence des relevés</label>
            <select
              className="select select-bordered focus:outline-none"
              name="refreshRate"
              id="refreshRate"
              value={refreshRate / 3600}
              onChange={handleChangeRefreshRate}
            >
              <option value={24}>24 heures</option>
              <option value={12}>12 heures</option>
              <option value={6}>6 heures</option>
              <option value={3}>3 heures</option>
              <option value={1}>1 heure</option>
            </select>
          </div>

          <FieldNumber
            label="Taux d'humidité minimum"
            name="threshold"
            min={0}
            max={100}
            data={data}
          />

          <div className="w-full flex justify-end">
            <button
              className={`${
                capteur !== undefined
                  ? "w-full flex items-center gap-x-2 "
                  : "flex items-center gap-x-2 "
              } btn btn-primary`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate animate-spin" />
              ) : null}
              {label}
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
};

export default FormCapteurSettings;
