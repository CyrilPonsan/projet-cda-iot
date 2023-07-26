const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = "201";
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Allow requests from any origin, you can restrict it to specific origins if needed
    "Access-Control-Allow-Methods": "PUT", // Specify the allowed HTTP methods
    "Access-Control-Allow-Headers": "Content-Type", // Specify the allowed headers
  };
  // Nom de la table dans laquelle on va chercher des données
  let table = process.env.TABLE;

  try {
    const requestBody = JSON.parse(event.body);

    console.log({ requestBody });

    for (let item of requestBody) {
      await dynamo
        .put({
          TableName: table,
          Item: {
            id: item.id,
            date: item.date,
            hasBeenSeen: true,
            capteurId: item.capteurId,
            txHumidite: item.txHumidite,
          },
        })
        .promise();
    }
  } catch (error) {
    statusCode = "500";
    body = "Problème serveur.";
  } finally {
    body = JSON.stringify(body);
  }
  return { statusCode, headers, body };
};
