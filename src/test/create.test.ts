import { handler } from '../handlers/create';
import { expect } from '@jest/globals';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as testFn from 'lambda-tester';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from 'aws-sdk-client-mock';
import { loyaltyCardMock } from './mocks';

const mockDynamoClient = mockClient(DynamoDBDocumentClient);

describe('Create Handler', () => {

  beforeEach(() => {
    mockDynamoClient.reset();
  })

  const mockEvent = {
    body: JSON.stringify(loyaltyCardMock),
  } as APIGatewayProxyEvent;

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
    const mockEvent = {
      body: JSON.stringify(bodyError)
    } as APIGatewayProxyEvent;

    const response = await testFn(handler).event(mockEvent).expectResult();
    const responseBody = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(responseBody).toBe('The field fullName is required');
  });
});