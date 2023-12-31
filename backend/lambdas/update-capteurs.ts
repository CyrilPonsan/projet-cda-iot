const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = "201";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "PUT", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  // Nom de la table dans laquelle on va chercher des données
  let table = process.env.TABLE;

  try {
    const requestBody = JSON.parse(event.body);
    let { id, timer, alerte, date } = requestBody;

    if (!date) {
      date = new Date().toString();
    }

    await dynamo
      .put({
        TableName: table,
        Item: {
          id,
          timer,
          alerte,
          date,
        },
      })
      .promise();
    statusCode = "201";
    body = { message: "Mise à jour réussie" };
  } catch (error) {
    statusCode = "400";
    body = { message: error };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
