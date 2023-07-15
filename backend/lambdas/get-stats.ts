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
  let body: string | undefined;
  let capteurData = new Array<any>();
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
      FilterExpression: "capteurId = :capteurId",
      ExpressionAttributeValues: {
        ":capteurId": capteurId,
      },
    };

    const response = await dynamo.scan(params).promise();

    if (response.Count === 0) {
      statusCode = 404;
      body = `Aucune données pour le capteur: ${capteurId}.`;
    } else {
      const items = response.Items;

      // Sort the items by the "date" field in descending order
      items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      items.forEach((item: any) => capteurData.push(item));
    }
  } catch (err: any) {
    statusCode = 400;
    body = err.message;
  }

  try {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: table,
      Key: {
        id: capteurId,
      },
    };
    const response = await dynamo.get(params).promise();
    if (response.Item) {
      body = { ...response.Item, capteurData };
      console.log({ body });
    } else {
      statusCode = 404;
      body = `Aucune données pour le capteur: ${capteurId}.`;
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
