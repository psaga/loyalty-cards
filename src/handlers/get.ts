'use strict';

import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { loyaltyCardService } from "../services";
import { mapperIdArrayToCardId, mapperJSONResponse } from '../utils/mappers';
import middify from '../utils/middify';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    const loyaltyCardIdParam = event.pathParameters?.id as string;
    if (!loyaltyCardIdParam) {
      throw new Error('Id is missing');
    }
    const digitArray = loyaltyCardIdParam.split('').map(Number);
    const loyaltyCardId = mapperIdArrayToCardId(digitArray);
    const loyaltyCard = await loyaltyCardService.getLoyaltyCard(loyaltyCardId);

    return mapperJSONResponse(200, loyaltyCard);
  } catch (err) {
    console.error(err);
    return mapperJSONResponse(400, err.message || `Couldn't get loyalty card`);
  }
});