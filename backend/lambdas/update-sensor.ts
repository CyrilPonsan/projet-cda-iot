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
    const sensorId = event.pathParameters.sensorId;

    // validation des données entrantes
    if (!sensorId || !regexNumber.test(sensorId)) {
      throw badRequest;
    }

    const data = JSON.parse(event.body);
    console.log("data", data);

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

    let stmt = `UPDATE ${table1} SET name=?, threshold=?, timer=? WHERE id=?`;
    const [result] = await connection.query(stmt, [
      data.name,
      data.threshold,
      data.timer,
      sensorId,
    ]);

    body = JSON.stringify(result);
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
