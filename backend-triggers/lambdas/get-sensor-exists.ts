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
  let body: any;
  let statusCode = 200;

  const badRequest: any = { message: "Requête invalide." };
  badRequest.status = 400;

  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "GET", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",
  }; // Specify the allowed headers
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

    connection = await mysql.createConnection(connectionConfig);

    const sensorName = event.pathParameters.name;

    if (!sensorName || !regexGeneric.test(sensorName)) {
      throw badRequest;
    }
    const selectSensor = `SELECT * FROM ${table1} WHERE name = ?`;
    const [results] = await connection.query(selectSensor, [sensorName]);

    if (results.length === 0) {
      const notFound: any = new Error("Le capteur n'existe pas.");
      notFound.status = 404;
      throw notFound;
    }

    body = JSON.stringify(results[0]);
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
