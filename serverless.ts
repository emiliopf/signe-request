import type { AWS } from '@serverless/typescript';

import put from '@functions/put';
import get from '@functions/get';
import scan from '@functions/scan';

const serverlessConfiguration: AWS = {
  service: 'signeRequest',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { put, get, scan },
  resources: {
    Resources: {
      RequestPutRole : {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'RequestPutRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: {
              Effect: 'Allow',
              Principal: {
                Service: [
                  'lambda.amazonaws.com'
                ]
              },
              Action: 'sts:AssumeRole',
            }
          },
          Policies: [
            {
              PolicyName: 'RequestPutPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                    Resource: 'arn:aws:logs:*:*:*'
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:PutItem',
                    Resource: 'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/SigneRequest'
                  }
                ]
              }
            }
          ]
        }
      },
      RequestGetRole : {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'RequestGetRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: {
              Effect: 'Allow',
              Principal: {
                Service: [
                  'lambda.amazonaws.com'
                ]
              },
              Action: 'sts:AssumeRole',
            }
          },
          Policies: [
            {
              PolicyName: 'RequestPutPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                    Resource: 'arn:aws:logs:*:*:*'
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:GetItem',
                    Resource: 'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/SigneRequest'
                  }
                ]
              }
            }
          ]
        }
      },
      RequestScanRole : {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: 'RequestScanRole',
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: {
              Effect: 'Allow',
              Principal: {
                Service: [
                  'lambda.amazonaws.com'
                ]
              },
              Action: 'sts:AssumeRole',
            }
          },
          Policies: [
            {
              PolicyName: 'RequestPutPolicy',
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                    Resource: 'arn:aws:logs:*:*:*'
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:Scan',
                    Resource: 'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/SigneRequest'
                  }
                ]
              }
            }
          ]
        }
      },
      RequestDynamoDbTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Delete',
        Properties: {
          TableName: 'SigneRequest',
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ],
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
