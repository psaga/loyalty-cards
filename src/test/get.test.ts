import { handler } from '../handlers/get';
import { expect } from '@jest/globals';
import * as testFn from 'lambda-tester';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('Get Handler', () => {
    beforeEach(() => {
        mockDynamoClient.reset();
    })

    it('should get a loyalty card', async () => {
        const mockedId = '1234-1234-1234-1234';
        mockDynamoClient.on(GetCommand).resolves({
            Item: {
                id: mockedId
            }
        });

        const idParam = mockedId.replace(/-/g, '');
        const responseGet = await testFn(handler).event({ pathParameters: { id: idParam } }).expectResult();
        const responseBody = JSON.parse(responseGet.body);

        expect(responseGet.statusCode).toBe(200);
        expect(responseBody).toBeDefined();
        expect(responseBody.id).toEqual(mockedId);
    });

    it('should fails when trying missing the id', async () => {
        const responseGet = await testFn(handler).event({ pathParameters: { id: undefined } }).expectResult();
        const responseBody = JSON.parse(responseGet.body);
        expect(responseGet.statusCode).toBe(400);
        expect(responseBody).toBe('Id is missing');
    });
});