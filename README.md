# Introduction
Loyalty card system using Serverless + Node + Typescript + DynamoDB to deploy to AWS.

## Setup AWS CLI
- Create your own AWS account (if you don't have access to one).
- Setup AWS CLI in your local: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## Install dependencies

> Note: First make sure you have installed Node and npm.

`npm install`

## Run locally

For this step, you have to check out how to install and run DynamoDB locally https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html 

Then you can run the application locally and access the endpoints generated with the following command:

`npm run start`


## Test
To run the tests execute:
`npm run test`

## Deploy
Deploying will generate all the services required with CloudFormation in the AWS account that has been set up with the proper credentials previously
`npm run deploy`

## Potential Improvements
- Use Dynamoose to create consistency with models and validations.
- Implement authorization middleware to prevent public access to the endpoints (AWS Cognito).
- Encryption at rest.
