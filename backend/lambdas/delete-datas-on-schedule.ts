import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = 500;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "POST", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };

  const table = process.env.TABLE;

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: table,
      FilterExpression:
        "attribute_not_exists(hasBeenSeen) AND attribute_not_exists(timer)",
    };

    const response = await dynamo.scan(params).promise();

    const data = Array<any>();

    const today = new Date().getTime();

    for (const element of response.Items) {
      const date = new Date(element.date).getTime();
      const diff = today - date;

      // 2 mois
      if (diff > 1000 * 60 * 60 * 24 * 15) {
        data.push(element);
      }
    }

    console.log({ data });

    for (let element of data) {
      await dynamo
        .delete({ TableName: table, Key: { id: element.id } })
        .promise();
    }

    body = "Alertes supprimées avec succès";

    statusCode = 200;
  } catch (error: any) {
    body = error.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    headers,
    statusCode,
    body,
  };
};
