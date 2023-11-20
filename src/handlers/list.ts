'use strict';

import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { loyaltyCardService } from '../services';
import middify from '../utils/middify';
import { mapperJSONResponse } from '../utils/mappers';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    const { lastEvaluatedKey, ...filters} = event?.queryStringParameters || {};
    const lastEvaluatedKeyObject = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : null;

    const {LastEvaluatedKey, Items} = await loyaltyCardService.getAllLoyaltyCards(filters, lastEvaluatedKeyObject);
    
    return mapperJSONResponse(200, {LastEvaluatedKey, Items});
  } catch (err) {
    console.error(err);
    return mapperJSONResponse(400, err.message || `Couldn't get loyalty cards`);
  }
});
