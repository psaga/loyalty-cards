'use strict';

import { Handler, SQSEvent, SQSMessageAttributes } from 'aws-lambda';
import { loyaltyCardService } from '../services';
import { mapperSqsBodyToCreateLoyaltyCardDto } from '../utils/mappers';

export const handler: Handler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const messageAttributes: SQSMessageAttributes = record.messageAttributes;
      const parsedBody = JSON.parse(record.body);
      const createLoyaltyCardDto = mapperSqsBodyToCreateLoyaltyCardDto(parsedBody);
      const loyaltyCardId = await loyaltyCardService.createLoyaltyCard(createLoyaltyCardDto);
      console.info(`Cards from ${messageAttributes.File.stringValue} Idx: ${messageAttributes.Index.stringValue} created as ${loyaltyCardId}`);
    }
  } catch (error) {
    console.error(error);
  }
};