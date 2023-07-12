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
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "GET", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  const table = process.env.TABLE as string;

  try {
    const requestBody = JSON.parse(event.body); // Parse the request body
    console.log({ requestBody });

    const capteurs = requestBody; // Extract the capteurId and txHumidite properties
    console.log({ capteurs });

    let results = Array<any>();

    for (let i = 0; i < capteurs.length; i++) {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: table,
        FilterExpression: "capteurId = :capteurId",
        ExpressionAttributeValues: {
          ":capteurId": capteurs[i],
        },
      };

      const response = await dynamo.scan(params).promise();

      if (response.Count === 0) {
        statusCode = 404;
        body = `Aucune données pour le capteur: ${capteurs[i]}.`;
      } else {
        const items = response.Items;

        // Sort the items by the "date" field in descending order
        items.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        results.push(items[0]);
      }
    }
    body = JSON.stringify(results);
  } catch (err: any) {
    statusCode = 400;
    body = err.message;
  }

  return {
    statusCode,
    body,
    headers,
  };
};
