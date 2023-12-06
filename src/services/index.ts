import createDynamoDBClient from "../clients/database";
import createS3Client from "../clients/s3";
import LoyaltyCardService from "./loyalty-card";
import S3Service from "./s3";
import createSQSClient from "../clients/sqs";
import SqsService from './sqs';
import DynamoDBService from "./dynamodb";


const { DYNAMODB_TABLE } = process.env;

export const dynamoDbService = new DynamoDBService(createDynamoDBClient(), DYNAMODB_TABLE as string);

export const loyaltyCardService = new LoyaltyCardService(dynamoDbService);

export const s3Service = new S3Service(createS3Client());

export const sqsService = new SqsService(createSQSClient());
