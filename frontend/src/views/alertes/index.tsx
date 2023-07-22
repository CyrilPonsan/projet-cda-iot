import React, { useEffect, useState } from "react";

import useHttp from "../../hooks/use-http";
import Loader from "../../components/ui/loader";
import BackButton from "../../components/ui/back-button";
import AlertesList from "../../components/alertes-list";

const Alertes = () => {
  const [alertes, setAlertes] = useState<Array<any> | null>(null);
  const { sendRequest, isLoading } = useHttp();

  useEffect(() => {
    const applyData = (data: any) => {
      setAlertes(data);
    };
    sendRequest(
      {
        path: "/alertes",
      },
      applyData
    );
  }, [sendRequest]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : !isLoading && alertes ? (
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-4/6 h-4/6">
            <AlertesList alertes={alertes} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Alertes;
