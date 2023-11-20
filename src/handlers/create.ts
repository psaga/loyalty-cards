'use strict'

import { APIGatewayProxyEvent } from 'aws-lambda'
import { loyaltyCardService } from "../services";
import { mapperBodyToCreateLoyaltyCardDto, mapperJSONResponse } from '../utils/mappers';
import middify from '../utils/middify';

export const handler = middify(async (event: APIGatewayProxyEvent) => {
  try {
    const data = event.body ? JSON.parse(event.body) : null;
    console.log('heree')
    const createLoyaltyCardDto = mapperBodyToCreateLoyaltyCardDto(data);
    if (!createLoyaltyCardDto.fullName) {
      throw new Error('The field fullName is required');
    }
    if (!createLoyaltyCardDto.email) {
      throw new Error('The field email is required');
    }

    const loyaltyCardId = await loyaltyCardService.createLoyaltyCard(createLoyaltyCardDto);

    return mapperJSONResponse(201, { id: loyaltyCardId });
  } catch (err) {
    console.error(err);
    return mapperJSONResponse(400, err.message || `Couldn't create loyalty cards`);
  }
})