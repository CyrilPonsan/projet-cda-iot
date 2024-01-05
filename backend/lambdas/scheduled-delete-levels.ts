import AWS from "aws-sdk";
import mysql from "mysql2/promise";

export const handler = async (event: any, context: any) => {
  const setRandomNumber = (min: number, max: number) => {
    return Math.trunc(Math.random() * (max - min + 1) + min);
  };

  let body: any;
  let statusCode = 201;
  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  let connection: any;

  try {
    const connectionConfig = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      socketPath: process.env.SOCKET_PATH,
    };
    const table2 = process.env.TABLE_2;

    connection = await mysql.createConnection(connectionConfig);
    let stmt = `SELECT * FROM ${table2}`;
    const [result] = await connection.query(stmt);

    const today = new Date().getTime();
    let idsToDelete = Array<number>();
    const deltaTime = 15 * 24 * 60 * 60 * 1000;

    for (const res of result) {
      const date = new Date(res.created_at).getTime();

      if (today - date >= deltaTime) {
        idsToDelete = [...idsToDelete, res.id];
      }
    }

    if (idsToDelete.length > 0) {
      stmt = `DELETE FROM ${table2} WHERE id IN (${idsToDelete
        .map(() => "?")
        .join(",")})`;
      await connection.query(stmt, idsToDelete);
    }

    body = JSON.stringify({ message: "Données supprimées !" });
  } catch (error: any) {
    statusCode = error.status ?? 500;
    body = JSON.stringify({
      message: error.message ?? "Un problème est survenu.",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  return {
    statusCode,
    body,
    headers,
  };
};
