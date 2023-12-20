import AWS from "aws-sdk";
import mysql from "mysql2/promise";

exports.handler = async (event: any, context: any) => {
  const regexGeneric = /^[a-zA-Z0-9\s,.'\-+éàè?î!âôêû:\/ù]{1,}$/;
  const regexNumber = /^[0-9]*$/;

  let body: any;
  let statusCode = 200;

  const badRequest: any = { message: "Requête invalide." };
  badRequest.status = 400;

  const headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "POST", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type",
  }; // Specify the allowed headers
  let connection: any;

  body = JSON.parse(event.body);

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

    // validation des données entrantes
    if (
      !body.name ||
      !regexGeneric.test(body.name) ||
      !body.threshold ||
      !regexNumber.test(body.threshold) ||
      !body.timer ||
      !regexNumber.test(body.timer) ||
      !body.humidityLevel ||
      !regexNumber.test(body.humidityLevel)
    ) {
      throw badRequest;
    }

    connection = await mysql.createConnection(connectionConfig);

    const existingSensor = "SELECT id FROM sensor WHERE name = ?";
    const [rows] = await connection.query(existingSensor, [body.name]);

    const insertHumidityLevel = `INSERT INTO ${table2} (humidity_level, sensor_id) VALUES(?, ?);`;

    if (rows.length === 0) {
      const insertSensor = `INSERT INTO ${table1} (name, threshold, timer) VALUES(?, ?, ?);`;
      let [result] = await connection.query(insertSensor, [
        body.name,
        body.threshold,
        body.timer,
      ]);
      if (result.insertId) {
        [result] = await connection.query(insertHumidityLevel, [
          body.humidityLevel,
          result.insertId,
        ]);
      }
    } else {
      let [result] = await connection.query(insertHumidityLevel, [
        body.humidityLevel,
        rows[0].id,
      ]);
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
