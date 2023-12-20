import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";
import mysql from "mysql2/promise";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const regexGeneric = /^[a-zA-Z0-9\s,.'\-+éàè?î!âôêû:\/ù]{1,}$/;
  const regexNumber = /^[0-9]*$/;

  const badRequest: any = { message: "Requête invalide." };
  badRequest.status = 400;

  let body: any;
  let statusCode = 200;
  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "PUT", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",
  }; // Specify the allowed headers
  let connection: any;

  try {
    // validation des données entrantes

    const data = JSON.parse(event.body);
    if (
      !data.name ||
      !regexGeneric.test(data.name) ||
      !data.threshold ||
      !regexNumber.test(data.threshold) ||
      !data.timer ||
      !regexNumber.test(data.timer)
    ) {
      throw badRequest;
    }
    const connectionConfig = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      socketPath: process.env.SOCKET_PATH,
    };
    const table1 = process.env.TABLE_1;

    connection = await mysql.createConnection(connectionConfig);

    const existingSensorStmt = `SELECT * FROM ${table1} WHERE name = ?;`;
    const existingSensor = await connection.query(existingSensorStmt, [
      data.name,
    ]);

    if (existingSensor.length > 0) {
      const notAvailable: any = { message: "Ce capteur est déjà enregistré." };
      notAvailable.status = 400;
      throw notAvailable;
    }

    const createSensorStmt = `INSERT INTO ${table1} (name, threshold, timer) VALUES(?, ?, ?);`;
    const createdSensor = await connection.query(createSensorStmt, [
      data.name,
      data.threshold,
      data.timer,
    ]);

    body = createdSensor;
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
