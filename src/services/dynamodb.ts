import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { ItemLoyaltyCard } from "../utils/types";

class DynamoDBService {
    constructor(
        private readonly docClient: DynamoDBClient,
        private readonly tableName: string
    ) { }

    async getAll(lastEvaluatedKeyObject: Record<string, any> | undefined, filterExpressionJoined: string, expressionAttributeValues: Record<string, any>): Promise<QueryCommandOutput> {
        const command = new QueryCommand({
            TableName: this.tableName,
            IndexName: 'GSI1',
            KeyConditionExpression: 'gsi1pk = :gsi1pValue',
            ...(lastEvaluatedKeyObject && { ExclusiveStartKey: lastEvaluatedKeyObject }),
            ...(filterExpressionJoined && { FilterExpression: filterExpressionJoined }),
            ExpressionAttributeValues: expressionAttributeValues,
          });
        const commandResponse = await this.docClient.send(command);
        return commandResponse;
    }

    async getById(id: string) {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: {
              id,
            }
          });
        const commandResponse = await this.docClient.send(command);
        return commandResponse;
    }

    async create(item: ItemLoyaltyCard) {
        const createCommand = new PutCommand({
            TableName: this.tableName,
            Item: item
          })
        await this.docClient.send(createCommand);
    }


}
export default DynamoDBService;