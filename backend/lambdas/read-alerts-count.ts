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
    const table3 = process.env.TABLE_3;

    connection = await mysql.createConnection(connectionConfig);

    const readAlertCountStmt = `SELECT a.id, a.sensor_id, a.created_at FROM ${table3} a INNER JOIN (SELECT sensor_id, MAX(created_at) as max_created_at FROM ${table3} WHERE has_been_seen=false GROUP BY sensor_id) latest_alert ON a.sensor_id=latest_alert.sensor_id AND a.created_at=latest_alert.max_created_at;`;

    const [results] = await connection.query(readAlertCountStmt);
    body = JSON.stringify({ total: results.length });
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
