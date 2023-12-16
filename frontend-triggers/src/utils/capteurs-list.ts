/* export function getCapteursIds(): any | boolean {
  const { readFile } = window.electron.fsApi;
  readFile(
    "toto.txt",
    "utf-8",
    (err: NodeJS.ErrnoException | null, data: any) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(JSON.parse(data));

        return data;
      }
    }
  );
}
 */
