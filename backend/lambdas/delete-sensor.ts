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
    const table3 = process.env.TABLE_3;

    connection = await mysql.createConnection(connectionConfig);

    let stmt = `SELECT * FROM ${table1} WHERE id=?;`;
    const [result] = await connection.query(stmt, [sensorId]);

    if (result.length === 0) {
      const error: any = { message: "Le capteur n'existe pas." };
      error.status = 404;
      throw error;
    }

    async function transaction() {
      try {
        await connection.beginTransaction();

        const deleteAlertsStmt = `DELETE FROM ${table3} WHERE sensor_id=?;`;
        const deleteHumidityLevelsStmt = `DELETE FROM ${table2} WHERE sensor_id=?;`;
        const deleteSensorStmt = `DELETE FROM ${table1} WHERE id=?;`;
        await connection.query(deleteAlertsStmt, [sensorId]);
        await connection.query(deleteHumidityLevelsStmt, [sensorId]);
        await connection.query(deleteSensorStmt, [sensorId]);
        await connection.commit();
      } catch (error: any) {
        await connection.rollback();
        const transactionError: any = {
          message:
            "Le capteur et ses données n'ont pas pu être supprimés, réessayez plus tard...",
          status: 500,
        };
        throw transactionError;
      } finally {
        connection.end();
      }
    }
    await transaction();
    body = JSON.stringify({
      message: `Le capteur ${result[0].name} a été supprimé !`,
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
