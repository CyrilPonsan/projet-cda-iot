const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "POST", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };

  const table = process.env.TABLE;
  const cle = process.env.CLE;

  try {
    console.log("bonjour");

    const requestBody = JSON.parse(event.body);

    if (requestBody) {
      for (let itemId of requestBody) {
        await dynamo
          .delete({ TableName: table, Key: { id: itemId } })
          .promise();
      }
      body = "Alertes supprimées avec succès";
    } else {
      statusCode = 404;
      body = "ressource inexistante";
    }
  } catch (err: any) {
    statusCode = 500;
    console.log({ err });

    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
