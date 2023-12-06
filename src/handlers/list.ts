'use strict';

import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { loyaltyCardService } from '../services';
import middify from '../utils/middify';
import { mapperJSONResponse } from '../utils/mappers';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { listQueryStringSchema } from '../utils/schemas';

export const handler: Handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    listQueryStringSchema.parse(event.queryStringParameters)
    const { lastEvaluatedKey, ...filters} = event.queryStringParameters || {};
    const lastEvaluatedKeyObject = lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : null;

    const {LastEvaluatedKey, Items} = await loyaltyCardService.getAllLoyaltyCards(filters, lastEvaluatedKeyObject);
    
    return mapperJSONResponse(200, {LastEvaluatedKey, Items});
  } catch (err) {
    console.error(err);
    let errMessage = err.message || `Couldn't get loyalty cards`
    if (err instanceof ZodError) {
      errMessage = fromZodError(err);
    }
    return mapperJSONResponse(400, errMessage);
  }
});
