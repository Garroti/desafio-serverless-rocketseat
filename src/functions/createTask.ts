import { document } from "../utils/dynamodbClient"

interface ICreateCertificate {
  id: string
	title: string
	done: boolean
	deadline: string
}

export const handle = async (event) => {
  const { id, title, done, deadline } = JSON.parse(event.body) as ICreateCertificate
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "tasks",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  const taskAlreadyExists = response.Items[0];

  if (!taskAlreadyExists) {
    await document
      .put({
        TableName: "tasks",
        Item: {
          id,
          user_id,
          title,
          done,
          deadline
        },
      })
      .promise();
  
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Task created!",
      }),
      headers: {
        "Content-type": "application/json"
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Task allready exists!",
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}