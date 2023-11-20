import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import * as testFn from 'lambda-tester';
import { handler } from '../handlers/sqs-to-create';
import { SQSEvent } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mapperSqsBodyToCreateLoyaltyCardDto } from '../utils/mappers';
import { loyaltyCardSqsMock } from './mocks';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('SQS to Create Handler', () => {
    it('should a list of loyalty cards', async () => {

        const messageAttributes = {
            File: { dataType: 'String', stringValue: '/uploads/cards.csv' },
            Index: { dataType: 'String', stringValue: '0' }
        }

        const mockedSQSEvent = {
            Records: [
                {
                    body: JSON.stringify(loyaltyCardSqsMock),
                    messageAttributes
                } as unknown as SQSEvent
            ]
        }

        mockDynamoClient.on(PutCommand).resolves({});

        await testFn(handler).event(mockedSQSEvent).expectResult();

        expect(mockDynamoClient).toReceiveCommandTimes(PutCommand, 1);

        const loyaltyCardDto = mapperSqsBodyToCreateLoyaltyCardDto(loyaltyCardSqsMock);
        const lastPutExecuted = mockDynamoClient.commandCalls(PutCommand)[0];

        const args = lastPutExecuted.args[0].input;
        const loyaltyCardDtoKeys = Object.keys(loyaltyCardDto);
        for (const key of loyaltyCardDtoKeys) {
            expect(args.Item).toHaveProperty(key);
            expect(loyaltyCardDto ? [key] : null).toEqual(args.Item ? [key] : null);
        }
    })
})