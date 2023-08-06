import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let body: any | undefined;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "GET", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };

  const id = event.queryStringParameters?.id;

  const table = process.env.TABLE as string;
  try {
    const response = await dynamo
      .get({ TableName: table, Key: { id } })
      .promise();
    if (response.Item) {
      statusCode = 200; // Set the status code to 404 if the item is found
      body = "Ce capteur est bien enregistré";
    } else {
      statusCode = 500;
      body = "Ce capteur n'est pas encore enregistré";
    }
  } catch (error: any) {
    body = error.message;
    statusCode = 500; // Set a generic status code for internal server error
  } finally {
    body = JSON.stringify(body);
  }

  return {
    headers,
    statusCode,
    body,
  };
};
