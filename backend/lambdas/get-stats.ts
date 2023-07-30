import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";

type CapteurData = {
  id: string;
  capteurId: string;
  date: string;
  txHumidite: number;
};

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let body: any;
  let capteur: any;
  let capteurData = new Array<CapteurData>();
  let lastReading: any;
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

    console.log("item", response.Item);

    if (response.Item) {
      capteur = { ...response.Item };
    } else {
      statusCode = 404;
      throw new Error("Aucune données pour ce capteur.");
    }
  } catch (err: any) {
    console.log({ err });

    statusCode = 400;
    body = err.message;
  }

  try {
    if (capteur) {
      const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: table,
        FilterExpression:
          "capteurId = :capteurId AND attribute_not_exists(hasBeenSeen)",
        ExpressionAttributeValues: {
          ":capteurId": capteurId,
        },
      };

      const response = await dynamo.scan(params).promise();

      const items = response.Items;

      // Sort the items by the "date" field in descending order
      items.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      lastReading = items[0];

      capteurData = compileStats(items);

      body = { ...capteur, lastReading, capteurData };

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

function compileStats(records: Array<any>): Array<any> {
  const compiledStats: { [key: string]: Array<CapteurData> } = {};

  records.forEach((record) => {
    const dateKey = new Date(record.date);
    dateKey.setHours(0, 0, 0, 0); // Set time components to 00:00:00 for normalization
    const dateKeyString = dateKey.toISOString().slice(0, 10);

    if (compiledStats[dateKeyString]) {
      compiledStats[dateKeyString].push(record);
    } else {
      compiledStats[dateKeyString] = [record];
    }
  });

  const result: Array<any> = [];
  for (const dateKey in compiledStats) {
    if (Object.prototype.hasOwnProperty.call(compiledStats, dateKey)) {
      const data = compiledStats[dateKey];
      result.push({
        id: data[0].id,
        date: new Date(data[0].date).toLocaleDateString(),
        averageHumidity: getAverageHumidity(data),
        capteurId: data[0].capteurId,
      });
    }
  }

  console.log({ compiledStats });

  return result;
}

function getAverageHumidity(data: Array<CapteurData>): number {
  let total: number = 0;
  data.forEach((item) => (total += item.txHumidite));
  return Math.trunc(total / data.length);
}
