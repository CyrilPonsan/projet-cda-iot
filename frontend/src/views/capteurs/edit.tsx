import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import useHttp from "../../hooks/use-http";
import Capteur from "../../utils/types/capteur";
import FormCapteurSettings from "../../components/form-capteur-settings";
import Loader from "../../components/ui/loader";
import BackButton from "../../components/ui/back-button";

const Edit = () => {
  const { id } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [capteur, setCapteur] = useState<Capteur | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const applyData = (data: any) => {
      setCapteur(data);
    };
    if (id) {
      sendRequest(
        {
          path: `/one-capteur?capteurId=${id}`,
        },
        applyData
      );
    }
  }, [id, sendRequest]);

  const handleSubmit = (id: string, timer: number, alerte: number) => {
    const values = { id, timer, alerte, date: capteur!.date };
    const applyData = (data: any) => {
      nav(`/capteurs/details/${capteur!.id}`);
    };
    sendRequest(
      {
        path: "/update",
        method: "put",
        body: values,
      },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Toaster />
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-4/6 h-4/6 flex flex-col justify-start items-start gap-y-8">
          <div className="w-full flex justify-start gap-x-4">
            <BackButton url={`/capteurs/details/${id}`} />
            <h1 className="font-bold text-xl text-primary">
              Mise à jour des paramètres
            </h1>
          </div>
          {isLoading ? (
            <Loader />
          ) : !isLoading && capteur ? (
            <FormCapteurSettings
              label="Enregistrer les modifications"
              capteur={capteur}
              onSubmit={handleSubmit}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Edit;
