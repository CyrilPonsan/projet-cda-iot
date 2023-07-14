import { useCallback, useState } from "react";
import axios from "axios";
import BASE_URL from "../config/urls";

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
            response = await axios.delete(`${BASE_URL}${req.path}`);
            break;
          default:
            response = await axios.get(`${BASE_URL}${req.path}`);
            break;
        }

        applyData(response.data);
      } catch (err: any) {
        console.log(err);

        if (err.response && err.response.data) {
          setError(err.response.data);
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
        console.log("hello");
      }
    },
    []
  );

  return { isLoading, error, sendRequest };
};

export default useHttp;
