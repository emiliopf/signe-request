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
    stage: 'dev',
    region: 'eu-west-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      DYNAMODB_TABLE: 'SigneRequest'
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
                    Resource: {
                      //arn:partition:service:region:account-id:resource-type/resource-id
                      'Fn::Sub': 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:*'
                    }
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:PutItem',
                    Resource: {
                      'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${self:provider.environment.DYNAMODB_TABLE}'
                    }
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
                    Resource: {
                      'Fn::Sub': 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:*'
                    }
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:GetItem',
                    Resource: {
                      'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${self:provider.environment.DYNAMODB_TABLE}'
                    }                  
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
                    Resource: {
                      'Fn::Sub': 'arn:aws:logs:${AWS::Region}:${AWS::AccountId}:*'
                    }
                  },
                  {
                    Effect: 'Allow',
                    Action: 'dynamodb:Scan',
                    Resource: {
                      'Fn::Sub': 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${self:provider.environment.DYNAMODB_TABLE}'
                    }                  }
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
          TableName: '${self:provider.environment.DYNAMODB_TABLE}',
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
