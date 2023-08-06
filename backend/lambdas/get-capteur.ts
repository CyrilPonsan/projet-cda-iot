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
  let capteur: any;
  let body: any | undefined;
  let lastReading = new Array<any>();
  let statusCode = 500;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "POST", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  const table = process.env.TABLE as string;
  const capteurId = event.queryStringParameters?.capteurId;

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      Key: {
        id: capteurId,
      },
    };

    const response = await dynamo.get(params).promise();

    console.log({ response });

    if (!response.Item) {
      statusCode = 404;
      throw new Error(`Aucun capteur pour l'identifiant : ^${capteurId}`);
    } else {
      capteur = response.Item;

      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: table,
        FilterExpression:
          "capteurId = :capteurId AND attribute_not_exists(hasBeenSeen)",
        ExpressionAttributeValues: {
          ":capteurId": capteurId,
        },
      };

      const result = await dynamo.scan(params).promise();

      const items = result.Items;

      console.log(items[0]);

      // Sort the items by the "date" field in descending order
      lastReading = items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      statusCode = 200;
      body = { ...capteur, lastReading };
    }
  } catch (err: any) {
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
