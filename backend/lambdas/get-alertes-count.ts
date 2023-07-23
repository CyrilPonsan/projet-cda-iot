import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";

type Alerte = {
  id: string;
  date: string;
  hasBeenSeen: boolean;
  txHumidite: number;
};

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let body: any;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "GET", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  const table = process.env.TABLE as string;

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression: "hasBeenSeen = :value",
      ExpressionAttributeValues: {
        ":value": false,
      },
    };
    const response = await dynamo.scan(params).promise();

    if (response.Items) {
      body = { total: response.Items.length };
    }
  } catch (error) {
    statusCode = 404;
    throw new Error("Aucune nouvelle alrte");
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
