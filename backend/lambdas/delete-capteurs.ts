const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "DELETE", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };

  const table = process.env.TABLE;
  const cle = process.env.CLE;

  try {
    console.log("bonjour");

    const eventId = event.queryStringParameters.id;
    console.log({ eventId });

    if (eventId) {
      await dynamo.delete({ TableName: table, Key: { id: eventId } }).promise();
      body = { message: "done" };
    } else {
      statusCode = 404;
      body = { message: "ressource inexistante" };
    }
  } catch (err: any) {
    statusCode = 500;
    console.log({ err });

    body = { message: err.message };
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
