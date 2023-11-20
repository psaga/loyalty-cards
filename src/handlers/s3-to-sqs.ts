'use strict';

import { Handler, S3Event } from 'aws-lambda';
import { s3Service, sqsService } from '../services';
import { parseCSV } from '../utils/csv';

export const handler: Handler = async (event: S3Event) => {
  try {
    if (event.Records === null) {
      throw new Error('Error: Event has no records.');
    }
    for (let i = 0; i < event.Records.length; i++) {
      const record = event.Records[i];
      const str = await s3Service.getObject(record);
      if (str) {
        const cards = parseCSV(str);
        for (const [idx, card] of cards.entries()) {
          await sqsService.sendMessage(record.s3.object.key, idx, card);
        }
        console.info(`Cards from ${record.s3.object.key} added to SQS`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};