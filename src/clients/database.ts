
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const createDynamoDBClient = (): DynamoDBClient => {
    const client = new DynamoDBClient({region: process.env.REGION});
    const docClient = DynamoDBDocumentClient.from(client);

    return docClient; 
}

export default createDynamoDBClient;