import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();

const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters;

  const params = {
    TableName: 'SigneRequest',
    Key: {
      id
    }
  }

  try {
    const data = await dynamoDb.get(params).promise();

    if (data.Item) {
      return formatJSONResponse(data);
    } else {
      return formatJSONResponse(
        {message: `Request ${id} not found.`},
        404
      )
    }
  } catch (error) {
    return error;
  }
}


export const main = middyfy(get);
