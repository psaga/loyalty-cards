'use strict'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { loyaltyCardService } from "../services";
import { mapperBodyToCreateLoyaltyCardDto, mapperJSONResponse } from '../utils/mappers';
import middify from '../utils/middify';
import { createBodySchema } from '../utils/schemas';
import {ZodError} from 'zod';
import { fromZodError } from 'zod-validation-error';


export const handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    createBodySchema.parse(event.body)
    const createLoyaltyCardDto = mapperBodyToCreateLoyaltyCardDto(event.body);
    const loyaltyCardId = await loyaltyCardService.createLoyaltyCard(createLoyaltyCardDto);

    return mapperJSONResponse(201, { id: loyaltyCardId });
  } catch (err) {
    console.error(err);
    let errMessage = err.message || `Couldn't create loyalty cards`
    if (err instanceof ZodError) {
      errMessage = fromZodError(err);
    }
    return mapperJSONResponse(400, errMessage);
  }
})