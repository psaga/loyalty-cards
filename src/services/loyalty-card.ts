import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import LoyaltyCard from "../models/loyalty-card";
import { PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { GetAllLoyaltyCardsResponse, FiltersParams } from "../utils/types";
import CreateLoyaltyCard from "../dtos/create-loyalty-card-dto";
import { mapperIdArrayToCardId, mapperLoyaltyCardDtoToLoyaltyCard, mapperLoyaltyCardsDtoToLoyaltyCard } from "../utils/mappers";

class LoyaltyCardService {
  constructor(
    private readonly docClient: DynamoDBClient,
    private readonly tableName: string
  ) { }

  async getAllLoyaltyCards(filters: FiltersParams, lastEvaluatedKeyObject?: Record<string, any>): Promise<GetAllLoyaltyCardsResponse> {
    const filterExpressions = [];
    const expressionAttributeValues = {
      ':gsi1pValue': 'TYPE:HOLDER'
    } as any;

    if (filters.fullName) {
      filterExpressions.push('contains(fullName, :fullnameValue)');
      expressionAttributeValues[':fullnameValue'] = filters.fullName;
    }

    if (filters.verifiedEmail) {
      filterExpressions.push('verifiedEmail = :verifiedEmailValue');
      expressionAttributeValues[':verifiedEmailValue'] = filters.verifiedEmail === 'true';
    }

    if (filters.gender) {
      filterExpressions.push('gender = :genderValue');
      expressionAttributeValues[':genderValue'] = filters.gender;
    }

    const filterExpressionJoined = filterExpressions.join(' AND ');


    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'gsi1pk = :gsi1pValue',
      ...(lastEvaluatedKeyObject && { ExclusiveStartKey: lastEvaluatedKeyObject }),
      ...(filterExpressions.length && { FilterExpression: filterExpressionJoined }),
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const commandResponse = await this.docClient.send(command);

    return {
      Items: mapperLoyaltyCardsDtoToLoyaltyCard(commandResponse.Items),
      LastEvaluatedKey: commandResponse.LastEvaluatedKey
    }
  }

  async getLoyaltyCard(id: string): Promise<LoyaltyCard> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        id,
      }
    });
    const result = await this.docClient.send(command);
    return mapperLoyaltyCardDtoToLoyaltyCard(result.Item);
  }

  async createLoyaltyCard(loyaltyCardDto: CreateLoyaltyCard, tries: number = 5): Promise<string | void> {
    try {
      const timestamp = new Date().getTime()
      const id = generateRandomID();
      const createCommand = new PutCommand({
        TableName: this.tableName,
        Item: {
          id,
          ...loyaltyCardDto,
          gsi1pk: 'TYPE:HOLDER',
          gsi1sk: loyaltyCardDto.fullName,
          updatedAt: timestamp,
          createdAt: timestamp,
        }
      })
      await this.docClient.send(createCommand);
      console.info(`Loyalty card: ${id} created successfully`);
      return id;
    } catch (error) {
      if (esErrorDeColision(error) && tries > 0) {
        console.info("Collision detected. Retrying with a new ID.");
        return await this.createLoyaltyCard(loyaltyCardDto, tries - 1);
      } else {
        console.error("Error saving the item in DynamoDB:", error);
      }
    }
  }
}

const generateRandomID = (): string => {
  const getRandomDigit = () => Math.floor(Math.random() * 10);
  const randomDigits = Array.from({ length: 16 }, getRandomDigit);

  return mapperIdArrayToCardId(randomDigits);
}

const esErrorDeColision = (error: any): boolean => {
  return error.code === "ConditionalCheckFailedException";
}

export default LoyaltyCardService;