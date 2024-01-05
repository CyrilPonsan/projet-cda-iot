import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";
import mysql from "mysql2/promise";

interface Result {
  id: number;
  name: string;
  threshold: number;
  humidityLevel: number;
  createdAt: string;
  sensorCreatedAt: string;
}

interface Statistique {
  id: number;
  average: number;
  date: string;
}

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

    let stmt = `SELECT h.humidity_level as humidityLevel, h.created_at as createdAt, h.id, s.name, s.threshold, s.timer, s.created_at as sensorCreatedAt FROM ${table2} as h INNER JOIN ${table1} as s ON h.sensor_id = s.id WHERE h.sensor_id = ? ORDER BY h.created_at DESC;`;
    const [result] = await connection.query(stmt, [sensorId]);

    const response = {
      id: sensorId,
      name: result[0].name,
      threshold: result[0].threshold,
      timer: result[0].timer,
      humidityLevel: result[0].humidityLevel,
      createdAt: result[0].createdAt,
      sensorCreatedAt: result[0].sensorCreatedAt,
      stats: compileStats(result),
    };

    body = JSON.stringify(response);
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

function compileStats(records: Array<Result>): Array<Statistique> {
  let compiledStats = Array<Statistique>();
  let index = 1;
  let day = 0;
  records.forEach((record: Result) => {
    if (new Date(record.createdAt).getDate() !== day) {
      day = new Date(record.createdAt).getDate();
      let tmp = Array<Result>();
      for (let i = 0; i < records.length; i++) {
        if (new Date(records[i].createdAt).getDate() === day) {
          tmp = [...tmp, records[i]];
        }
      }
      const tmpDate = new Date(record.createdAt);
      let date = new Date(
        tmpDate.getFullYear(),
        tmpDate.getMonth(),
        tmpDate.getDate()
      );
      const statItem: Statistique = {
        id: index,
        average: getAverageHumidity(tmp),
        date: date.toLocaleDateString(),
      };
      compiledStats = [...compiledStats, statItem];
      index += 1;
    }
  });
  return compiledStats;
}

function getAverageHumidity(data: Array<Result>): number {
  let total: number = 0;
  data.forEach((item) => (total += item.humidityLevel));
  return Math.trunc(total / data.length);
}
