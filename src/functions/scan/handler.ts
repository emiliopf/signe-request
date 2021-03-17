import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

const dynamoDb = new DynamoDB.DocumentClient();

const scan = async (): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: 'SigneRequest'
  }

  try {
    const data = await dynamoDb.scan(params).promise();

    return formatJSONResponse(data);
  } catch (error) {
    return error;
  }
}


export const main = middyfy(scan);
