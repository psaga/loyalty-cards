import { handler } from '../handlers/list';
import { expect } from '@jest/globals';
import * as testFn from 'lambda-tester';
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('List Handler', () => {
    beforeEach(() => {
        mockDynamoClient.reset();
    })

    it('should get a list of loyalty cards', async () => {
        mockDynamoClient.on(QueryCommand).resolves({ Items: [] });
        const result = await testFn(handler).event({queryStringParameters: null}).expectResult();
        const responseBody = JSON.parse(result.body);

        expect(result.statusCode).toBe(200);
        expect(responseBody).toBeDefined();
        expect(responseBody.Items).toBeDefined();
    });
});