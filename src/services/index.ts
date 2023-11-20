import createDynamoDBClient from "../clients/database";
import createS3Client from "../clients/s3";
import LoyaltyCardService from "./loyalty-card";
import S3Service from "./s3";
import createSQSClient from "../clients/sqs";
import SqsService from './sqs';


const { DYNAMODB_TABLE } = process.env;

export const loyaltyCardService = new LoyaltyCardService(createDynamoDBClient(), DYNAMODB_TABLE as string);

export const s3Service = new S3Service(createS3Client());

export const sqsService = new SqsService(createSQSClient());
