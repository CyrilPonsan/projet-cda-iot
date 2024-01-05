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
  const regexNumber = /^[0-9]*$/;

  const badRequest: any = { message: "Requête invalide." };
  badRequest.status = 400;

  let body: any;
  let statusCode = 200;
  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "DELETE", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",
  }; // Specify the allowed headers
  let connection: any;

  console.log(event);

  try {
    const data = JSON.parse(event.body);

    const { ids } = data;

    // validation des données entrantes
    ids.forEach((item: number) => {
      if (!regexNumber.test(item.toString())) {
        throw badRequest;
      }
    });

    const connectionConfig = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      socketPath: process.env.SOCKET_PATH,
    };
    const table3 = process.env.TABLE_3;

    connection = await mysql.createConnection(connectionConfig);

    let stmt = `DELETE FROM ${table3} WHERE id IN (${ids
      .map(() => "?")
      .join(",")})`;
    await connection.query(stmt, ids);

    body = JSON.stringify({
      message: "Alertes supprimées.",
    });
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

function testField(field: string) {
  const fields = ["createdAt", "hasBeenSeen"];
  return fields.includes(field);
}
