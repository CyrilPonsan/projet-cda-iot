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
    const table1 = process.env.TABLE_1;
    const table2 = process.env.TABLE_2;

    connection = await mysql.createConnection(connectionConfig);

    const readHumidityLevelsStmt = `SELECT h.id, h.humidity_level, h.sensor_id, s.threshold 
                                FROM ${table2} h 
                                INNER JOIN ${table1} s ON h.sensor_id = s.id
                                WHERE (h.sensor_id, h.id) IN 
                                    (SELECT sensor_id, MAX(id) AS max_id 
                                     FROM ${table2} 
                                     GROUP BY sensor_id)`;

    const [results] = await connection.query(readHumidityLevelsStmt);

    for (const result of results) {
      let newLevel =
        result.humidity_level === 0 || result.humidity_level < result.threshold
          ? 100
          : result.humidity_level - setRandomNumber(0, 5);
      if (newLevel < 0) {
        newLevel = 0;
      }
      const stmt = `INSERT INTO ${table2} (humidity_level, sensor_id) VALUES (?, ?);`;
      await connection.query(stmt, [newLevel, result.sensor_id]);
    }
    body = JSON.stringify({ message: "Données enregistrées !" });
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
