import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();

const put = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { body } = event;
  const id = uuid();

  const params = {
    TableName: 'SigneRequest',
    Item: {
      id,
      body
    }
  }

  try {
    await dynamoDb.put(params).promise();
    
    return formatJSONResponse({
      message: `Request ${id} saved.`,
      data: body
    });
  } catch (error) {
    return error;
  }
}


export const main = middyfy(put);
