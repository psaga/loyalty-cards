import { handler } from '../handlers/get';
import { expect } from '@jest/globals';
import * as testFn from 'lambda-tester';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('Get Handler', () => {
    const mockedId = '1234-1234-1234-1234';
    const idParam = mockedId.replace(/-/g, '');

    beforeEach(() => {
        mockDynamoClient.reset();
    })

    it('should get a loyalty card', async () => {
        mockDynamoClient.on(GetCommand).resolves({
            Item: {
                id: mockedId
            }
        });

        const responseGet = await testFn(handler).event({ pathParameters: { id: idParam } }).expectResult();
        const responseBody = JSON.parse(responseGet.body);

        expect(responseGet.statusCode).toBe(200);
        expect(responseBody).toBeDefined();
        expect(responseBody.id).toEqual(mockedId);
    });

    it('should fails when trying missing the id', async () => {
        const zodFailedResponse = {"details": [{"code": "invalid_type", "expected": "string", "message": "Required", "path": ["id"], "received": "undefined"}], "name": "ZodValidationError"}
        const responseGet = await testFn(handler).event({ pathParameters: { id: undefined } }).expectResult();
        const responseBody = JSON.parse(responseGet.body);
        expect(responseGet.statusCode).toBe(400);
        expect(responseBody).toEqual(zodFailedResponse);
    });

    it('should returns 404 when Item is not found', async () => {
        mockDynamoClient.on(GetCommand).resolves({
            Item: undefined
        });
        const responseGet = await testFn(handler).event({ pathParameters: { id: idParam } }).expectResult();
        const responseBody = JSON.parse(responseGet.body);
        expect(responseGet.statusCode).toBe(404);
        expect(responseBody).toBe('Loyalty card not found');
    });
});