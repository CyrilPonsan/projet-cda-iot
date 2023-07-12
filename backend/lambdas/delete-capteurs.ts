const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const table = process.env.TABLE;
  const cle = process.env.CLE;

  try {
    const eventId = event.pathParameters;

    if (eventId) {
      body = await dyanamo
        .delete({ TableName: table, Key: { id: eventId } })
        .promise();
    } else {
      statusCode = 404;
      body = { message: "ressource inexistante" };
    }
  } catch (err: any) {
    statusCode = 400;
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
