const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
  };
  // Nom de la table dans laquelle aller chercher des données
  let table = process.env.TABLE;

  const date = new Date().toString();
  const defaultTimer = 3 * 60 * 60;

  try {
    const requestBody = JSON.parse(event.body); // Parse the request body
    const { capteurId, txHumidite } = requestBody; // Extract the capteurId and txHumidite properties

    const response = await dynamo
      .get({
        TableName: table,
        Key: { id: capteurId },
      })
      .promise();
    if (response.Item) {
      if (txHumidite <= response.Item.alerte) {
        console.log("coucou");
        const hasBeenSeen = false;

        await dynamo
          .put({
            TableName: table,
            Item: {
              id: `alerte-${context.awsRequestId}`,
              date: date,
              hasBeenSeen,
              txHumidite: txHumidite,
            },
          })
          .promise();
      }
    } else {
      await dynamo
        .put({
          TableName: table,
          Item: {
            id: capteurId,
            alerte: 25,
            timer: defaultTimer,
            date,
          },
        })
        .promise();
    }

    await dynamo
      .put({
        TableName: table,
        Item: {
          id: context.awsRequestId,
          capteurId: capteurId,
          txHumidite: txHumidite,
          date: date,
        },
      })
      .promise();

    if (response.Item) {
      body = response.Item.timer;
    } else {
      body = defaultTimer;
    }
  } catch (err: any) {
    statusCode = "400";
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
