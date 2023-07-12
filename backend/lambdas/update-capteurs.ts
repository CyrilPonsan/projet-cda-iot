const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  let body;
  console.log({ body });

  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
  };
  // Nom de la table dans laquelle aller chercher des données
  let table = process.env.TABLE;
  let cle = process.env.CLE;

  for (let prop in event) {
    console.log(prop, event[prop]);
  }

  try {
    body = await dynamo
      .update({
        TableName: table,
        Key: {
          [cle]: event.id,
        },
        UpdateExpression: "set humidite = :humide",
        ExpressionAttributesValues: {
          ":humide": event.humide,
        },
      })
      .promise();
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
