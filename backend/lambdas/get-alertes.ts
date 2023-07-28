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
  const capteurId = event.queryStringParameters?.capteurId;

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression:
        "#hasBeenSeenAttr = :value_true OR #hasBeenSeenAttr = :value_false",
      ExpressionAttributeNames: {
        "#hasBeenSeenAttr": "hasBeenSeen",
      },
      ExpressionAttributeValues: {
        ":value_true": true,
        ":value_false": false,
      },
    };

    const response = await dynamo.scan(params).promise();

    const items = response.Items;

    if (items) {
      items.map((item: any) => {
        let date = new Date(item.date);
        item.date = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      });

      items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      body = items;
    } else {
      throw new Error("Aucune alerte enregistrée.");
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
