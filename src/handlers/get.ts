'use strict';

import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { loyaltyCardService } from "../services";
import { mapperIdArrayToCardId, mapperJSONResponse } from '../utils/mappers';
import middify from '../utils/middify';
import { getParameterSchema } from '../utils/schemas';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    getParameterSchema.parse(event.pathParameters)
    const loyaltyCardIdParam = event.pathParameters?.id as string;
    const digitArray = loyaltyCardIdParam.split('').map(Number);
    const loyaltyCardId = mapperIdArrayToCardId(digitArray);
    const loyaltyCard = await loyaltyCardService.getLoyaltyCard(loyaltyCardId);
    if(!loyaltyCard) {
      return mapperJSONResponse(404, 'Loyalty card not found');
    }
    return mapperJSONResponse(200, loyaltyCard);
  } catch (err) {
    let errMessage = err.message || `Couldn't get loyalty card`
    if (err instanceof ZodError) {
      errMessage = fromZodError(err);
    }
    return mapperJSONResponse(400, errMessage);
  }
});