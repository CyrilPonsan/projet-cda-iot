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
        FilterExpression: "capteurId = :capteurId",
        ExpressionAttributeValues: {
          ":capteurId": capteurId,
        },
      };

      const response = await dynamo.scan(params).promise();

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

        capteurData = compileStats(capteurData);

        body = { ...capteur, capteurData };
      }
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

function compileStats(records: Array<CapteurData>) {
  const compiledStats = Array<CapteurData>();
  let tmp = Array<CapteurData>();
  let lastDate = new Date(records[0].date);
  records.forEach((record) => {
    if (new Date(record.date).getDate() === lastDate.getDate()) {
      tmp.push(record);
    } else {
      if (tmp.length > 0) {
        compiledStats.push({
          id: tmp[0].id,
          date: tmp[0].date,
          txHumidite: getAverageHumidity(tmp),
          capteurId: tmp[0].capteurId,
        });
        tmp = [];
        tmp.push(record);
        lastDate = new Date(record.date);
      } else {
        tmp.push(record);
        lastDate = new Date(record.date);
      }
    }
  });
  return compiledStats;
}

function getAverageHumidity(data: Array<CapteurData>) {
  let total: number = 0;
  data.forEach((item) => (total += item.txHumidite));
  return Math.trunc(total / data.length);
}
