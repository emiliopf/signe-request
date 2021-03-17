import { APIGatewayProxyResult } from "aws-lambda"


export const formatJSONResponse = (response: any, statusCode: number = 200): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(response)
  }
}