const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: any, context: any) => {
  let body;
  let statusCode = "200";
  const headers = {
    "Content-Type": "application/json",
  };
  // Nom de la table dans laquelle on va chercher des données
  let table = process.env.TABLE;

  const date = new Date().toString();
  const defaultTimer = 24 * 60 * 60;
  let seuilAlerte = 25;

  try {
    const requestBody = JSON.parse(event.body);
    const { capteurId, txHumidite } = requestBody; // extraction des données contenues dans le corps de la requête

    // vérification qu'un capteur avec cette id existe
    const response = await dynamo
      .get({
        TableName: table,
        Key: { id: capteurId },
      })
      .promise();

    // le capteur est enregistré dans la bdd
    if (response.Item) {
      // on attibue la veleur du seuil d'alerte avec celle enregistrée pour le capteur
      seuilAlerte = response.Item.alerte;
    } else {
      // le capteur n'existe pas, on l'enregistre dans la bdd
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

    // enregistrement du relevé d'humidité dans la bdd
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

    // vérification si une alerte doit être générée
    if (txHumidite <= seuilAlerte) {
      const hasBeenSeen = false;

      // enregistrement de l'alerte dans la bdd
      await dynamo
        .put({
          TableName: table,
          Item: {
            id: `alerte-${context.awsRequestId}`,
            date: date,
            hasBeenSeen,
            txHumidite: txHumidite,
            capteurId,
          },
        })
        .promise();
    }

    // on envoie à l'esp l'intervalle de temps entre deux relevés
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
