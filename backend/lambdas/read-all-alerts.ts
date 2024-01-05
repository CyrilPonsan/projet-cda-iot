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
    "Access-Control-Allow-Methods": "DELETE", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",
  }; // Specify the allowed headers
  let connection: any;

  try {
    const page = event.queryStringParameters.page ?? 1;
    const limit = event.queryStringParameters.limit ?? 15;
    const field = event.queryStringParameters.field ?? "createdAt";
    const direction = event.queryStringParameters.direction ?? "true";

    // validation des données entrantes
    if (
      !regexNumber.test(page) ||
      !regexNumber.test(limit) ||
      !testField(field) ||
      (direction !== "true" && direction !== "false")
    ) {
      throw badRequest;
    }

    const l = +limit;
    const offset = (+page - 1) * +limit;
    const d = direction === "true" ? "DESC" : "ASC";

    const connectionConfig = {
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      socketPath: process.env.SOCKET_PATH,
    };
    const table1 = process.env.TABLE_1;
    const table2 = process.env.TABLE_2;
    const table3 = process.env.TABLE_3;

    connection = await mysql.createConnection(connectionConfig);

    let stmt = `SELECT a.id, a.has_been_seen AS hasBeenSeen, a.created_at AS createdAt, h.humidity_level AS humidityLevel, s.name FROM ${table3} a INNER JOIN ${table2} h ON a.level_id=h.id INNER JOIN ${table1} s ON a.sensor_id=s.id ORDER BY ${field} ${d} LIMIT ${l} OFFSET ${offset};`;
    const [result] = await connection.query(stmt);

    let totalStmt = `SELECT COUNT(*) FROM ${table3};`;
    const [total] = await connection.query(totalStmt);

    const totalPages = Math.ceil(total[0]["COUNT(*)"] / limit);

    body = JSON.stringify({
      totalPages,
      alertes: result,
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
