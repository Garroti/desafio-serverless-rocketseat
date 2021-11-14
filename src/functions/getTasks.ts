import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "tasks",
      FilterExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    })
    .promise();

  console.log(response)

  const tasks = response;

  return {
    statusCode: 200,
    body: JSON.stringify({
      tasks
    }),
  };
  
};