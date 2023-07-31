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
  let capteurs: any;
  let body: any | undefined;
  let lastReading = new Array<any>();
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "GET", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  const table = process.env.TABLE as string;
  const capteurId = event.queryStringParameters?.capteurId;

  console.log({ capteurId });

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression:
        "capteurId = :capteurId AND attribute_not_exists(hasBeenSeen)",
      ExpressionAttributeValues: {
        ":capteurId": capteurId,
      },
    };

    const response = await dynamo.scan(params).promise();

    if (response.Items.Count === 0) {
      statusCode = 404;
      body = `Aucune données pour le capteur.`;
    } else {
      const items = response.Items;

      // Sort the items by the "date" field in descending order
      const sortedItems = items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      body = sortedItems[0];

      console.log({ body });
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
