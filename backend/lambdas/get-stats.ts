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
  let body: any;
  let capteur: any;
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
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: table,
      Key: {
        id: capteurId,
      },
    };
    const response = await dynamo.get(params).promise();

    if (response.Item) {
      capteur = { ...response.Item };
      console.log({ capteur });
    } else {
      statusCode = 404;
      body = `Aucune données pour le capteur: ${capteurId}.`;
    }
  } catch (err: any) {
    console.log("error spotted");

    statusCode = 400;
    body = err.message;
  }

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression: "capteurId = :capteurId",
      ExpressionAttributeValues: {
        ":capteurId": capteurId,
      },
    };

    const response = await dynamo.scan(params).promise();

    console.log("capteurData:", response);

    if (response.Count === 0) {
      capteurData = [];
      body = { ...capteur, capteurData };
    } else {
      const items = response.Items;

      // Sort the items by the "date" field in descending order
      items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      items.forEach((item: any) => capteurData.push(item));
      console.log({ capteur, capteurData });

      body = { ...capteur, capteurData };
    }
  } catch (err: any) {
    statusCode = 400;
    body = err.message;
  } finally {
    console.log({ body });
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
