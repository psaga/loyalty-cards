import { handler } from '../handlers/create';
import { expect } from '@jest/globals';
import * as testFn from 'lambda-tester';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';
import { loyaltyCardMock } from './mocks';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('Create Handler', () => {

  beforeEach(() => {
    mockDynamoClient.reset();
  })

  const mockEvent = { body: loyaltyCardMock };

  it('should create a loyalty card and return the ID', async () => {
    mockDynamoClient.on(PutCommand).resolves({});

    const response = await testFn(handler).event(mockEvent).expectResult();
    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(responseBody).toBeDefined();
    expect(typeof responseBody.id).toBe('string');
  });

  it('should handle errors and return an error response', async () => {
    const { fullName, ...bodyError } = loyaltyCardMock;
    const zodFailedResponse = { "details": [{ "code": "invalid_type", "expected": "string", "message": "fullName is required", "path": ["fullName"], "received": "undefined" }], "name": "ZodValidationError" }
    const mockEvent = { body: bodyError };

    const response = await testFn(handler).event(mockEvent).expectResult();
    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(responseBody).toEqual(zodFailedResponse);
  });
});