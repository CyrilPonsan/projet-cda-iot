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
    "Access-Control-Allow-Methods": "POST", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  const table = process.env.TABLE as string;
  const capteurIds = JSON.parse(event.body);

  try {
    //
    const keysToGet = capteurIds.map((id: any) => ({
      id: id, // Use the correct key name 'id' here
    }));
    const response = await dynamo
      .batchGet({
        RequestItems: {
          [table]: {
            Keys: keysToGet, // Use the keysToGet array
          },
        },
      })
      .promise();

    // Traiter les résultats de la requête
    capteurs = response.Responses?.[table] || [];

    let results = Array<any>();
    for (let element of capteurs) {
      console.log("bonjour les relevés");

      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: table,
        FilterExpression:
          "capteurId = :capteurId AND attribute_not_exists(hasBeenSeen)",
        ExpressionAttributeValues: {
          ":capteurId": element.id,
        },
      };
      const capteurResponse = await dynamo.scan(params).promise();
      console.log({ capteurResponse });

      if (capteurResponse.Count === 0) {
        statusCode = 404;
        body = `Aucune données pour le capteur.`;
      } else {
        const items = capteurResponse.Items;

        // Sort the items by the "date" field in descending order
        const sortedItems = items.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        lastReading = sortedItems[0];
        results = [...results, { ...element, lastReading }];
      }
    }
    body = results;
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
