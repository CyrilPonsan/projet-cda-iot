import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): APIGatewayProxyResult => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!Array.isArray(requestBody)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid request body. Array of item IDs expected.",
        }),
      };
    }

    const tableName = "YourDynamoDBTableName";

    const deleteParams: AWS.DynamoDB.BatchWriteItemInput = {
      RequestItems: {
        [tableName]: requestBody.map((id) => ({
          DeleteRequest: {
            Key: {
              id,
            },
          },
        })),
      },
    };

    await dynamo.batchWrite(deleteParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Items deleted successfully." }),
    };
  } catch (error) {
    console.error("Error deleting items:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting items.",
      }),
    };
  }
};
