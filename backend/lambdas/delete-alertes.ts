import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): APIGatewayProxyResult => {
  let body: any;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  // Nom de la table dans laquelle on va chercher des données
  let table = process.env.TABLE;

  try {
    const requestBody = JSON.parse(event.body);

    console.log({ requestBody });

    if (!Array.isArray(requestBody)) {
      (statusCode = 400),
        (body = {
          message: "Invalid request body. Array of item IDs expected.",
        });
    }

    const tableName = "YourDynamoDBTableName";
    console.log(requestBody[0]);
    const itemId = requestBody[0];
    await dynamo
      .delete({ TableName: tableName, Key: { id: itemId } })
      .promise();

    statusCode = 200;
    body = { message: "Items deleted successfully." };
  } catch (error) {
    console.error("Error deleting items:", error);
    (statusCode = 500),
      (body = {
        message: "An error occurred while deleting items.",
      });
  } finally {
    body = JSON.stringify(body);
  }

  return {
    headers,
    body,
    statusCode,
  };
};
