/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/urls";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendRequest = useCallback(
    async (req: any, applyData: (data: any) => void) => {
      setIsLoading(true);
      setError("");
      let response: any;
      try {
        switch (req.method) {
          case "post":
            response = await axios.post(`${BASE_URL}${req.path}`, req.body, {
              headers: req.headers,
            });
            break;
          case "put":
            response = await axios.put(`${BASE_URL}${req.path}`, req.body);
            break;
          case "delete":
            response = await axios.delete(`${BASE_URL}${req.path}`, {
              data: req.body,
            });
            break;
          default:
            response = await axios.get(`${BASE_URL}${req.path}`);
            break;
        }

        applyData(response.data);
      } catch (err: any) {
        setError(err.response?.data.message ?? "erreur inconnue");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, error, sendRequest };
};

export default useHttp;
