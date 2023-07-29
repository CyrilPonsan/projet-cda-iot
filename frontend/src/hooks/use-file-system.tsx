import { useCallback } from "react";

const useFilesystem = () => {
  //const [data, setData] = useState<any>([]);

  const readData = useCallback((path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const { readFile } = window.electron.fsApi;
      readFile(
        path,
        "utf-8",
        (err: NodeJS.ErrnoException | null, data: any) => {
          if (err) {
            console.error(err);
            resolve("[]");
          } else {
            if (data.length === 0) {
              resolve("[]");
            } else {
              resolve(data);
            }
          }
        }
      );
    });
  }, []);

  const writeData = useCallback((path: string, dataToWrite: any) => {
    const { writeFile } = window.electron.fsApi;
    writeFile(
      path,
      JSON.stringify(dataToWrite),
      "utf-8",
      (err: NodeJS.ErrnoException | null) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
    console.log("done");
  }, []);

  const writeCapteur = useCallback(
    async (path: string, dataToWrite: string) => {
      const result = await readData(path);
      if (result) {
        console.log({ result });

        const updatedData = JSON.parse(result);
        console.log({ updatedData });

        updatedData.push(dataToWrite);
        console.log({ updatedData });

        writeData(path, updatedData);
      }
    },
    [readData, writeData]
  );

  const deleteCapteur = useCallback(
    async (path: string, capteurToRemoveId: string) => {
      const data = await readData(path);
      const list = JSON.parse(data);
      const updatedList = list.filter(
        (item: string) => item !== capteurToRemoveId
      );
      writeData(path, updatedList);
    },
    [readData, writeData]
  );

  return {
    //data,
    writeCapteur,
    readData,
    writeData,
    deleteCapteur,
  };
};

export default useFilesystem;
