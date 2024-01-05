import AWS from "aws-sdk";
import mysql from "mysql2/promise";

export const handler = async (event: any, context: any) => {
  let body: any;
  let statusCode = 200;
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

    const readAllSensorsStmt = `SELECT h.humidity_level as humidityLevel, h.created_at as createdAt, h.sensor_id as id, s.name as name, s.threshold as threshold FROM ${table2} h INNER JOIN (SELECT sensor_id, MAX(created_at) AS max_created_at FROM ${table2} GROUP BY sensor_id) latest_humidity ON h.sensor_id = latest_humidity.sensor_id AND h.created_at = latest_humidity.max_created_at INNER JOIN ${table1} s ON h.sensor_id = s.id;`;

    const [results] = await connection.query(readAllSensorsStmt);
    body = JSON.stringify(results);
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
