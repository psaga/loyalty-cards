import LoyaltyCard from "../models/loyalty-card";
import { GetAllLoyaltyCardsResponse, FiltersParams } from "../utils/types";
import CreateLoyaltyCard from "../dtos/create-loyalty-card-dto";
import { mapperIdArrayToCardId, mapperLoyaltyCardDtoToLoyaltyCard, mapperLoyaltyCardsDtoToLoyaltyCard } from "../utils/mappers";
import DynamoDBService from "./dynamodb";

class LoyaltyCardService {
  constructor(
    private readonly dynamoDbService: DynamoDBService
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

    const filterExpressionJoined = filterExpressions.length ? filterExpressions.join(' AND ') : '';

    const response = await this.dynamoDbService.getAll(lastEvaluatedKeyObject, filterExpressionJoined, expressionAttributeValues);

    return {
      Items: mapperLoyaltyCardsDtoToLoyaltyCard(response.Items),
      LastEvaluatedKey: response.LastEvaluatedKey
    }
  }

  async getLoyaltyCard(id: string): Promise<LoyaltyCard | null> {
    const response = await this.dynamoDbService.getById(id);
    if(!response.Item) return null
    return mapperLoyaltyCardDtoToLoyaltyCard(response.Item);
  }

  async createLoyaltyCard(loyaltyCardDto: CreateLoyaltyCard, tries: number = 5): Promise<string | void> {
    try {
      const timestamp = new Date().getTime()
      const id = generateRandomID();
      const item = {
        id,
        ...loyaltyCardDto,
        gsi1pk: 'TYPE:HOLDER',
        gsi1sk: loyaltyCardDto.fullName,
        updatedAt: timestamp,
        createdAt: timestamp
      }
      await this.dynamoDbService.create(item);
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